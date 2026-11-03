import React from 'react';
import {interpolate} from 'remotion';
import {Pose, rigPoints, toLocal} from '../engine/Stickman';
import {blend, env, gesture, idle, reach, walkTo} from '../kit/actions';
import {Actor, counterAt, useShot, useSpeaking} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Extra, Layer, Stage, Svg, camOn, clamp, ease, usePush} from '../kit/kit';
import {Board, FONT} from '../kit/ui';
import {Onoma} from '../reference/PauseTime';
import {BoxStreet, Clock, ConcertHall, Couch, Gym, Room, Stairwell, Tag} from './places';
import {FL, HS, HT, grow, guard, hip, hit, tagY} from './common';
import {Chalk, FS, hand, pill, shadow} from './shots2';

/* Часть 7 (094–102) и начало части 8 (103–108). Часы 23:41 — те же красные светодиоды, что в хуке.
   Табличка героя: день 25 → «22», день 32 → «29» (мигает вечером, как в хуке). */
export const Led: React.FC<{text: string; size?: number; left?: number; top?: number; right?: number}> = ({text, size = 80, left = 48, top = 40, right}) => (
	<div style={{position: 'absolute', left: right === undefined ? left : undefined, right, top, background: '#10141f', border: '5px solid #2c3646', borderRadius: 16, padding: '2px 24px', color: '#ff4a3a', fontFamily: FONT, fontWeight: 800, fontSize: size, textShadow: '0 0 12px #ff4a3a', lineHeight: 1.25}}>{text}</div>
);
const hm = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(Math.floor(m) % 60).padStart(2, '0')}`;
const rotPt = (cx: number, cy: number, dx: number, dy: number, deg: number): [number, number] => {
	const r = (deg * Math.PI) / 180;
	return [cx + dx * Math.cos(r) - dy * Math.sin(r), cy + dx * Math.sin(r) + dy * Math.cos(r)];
};
// герой, лежащий (rot=-84: голова влево) или стоящий (rot=0) вокруг точки бедра (x, y)
const Lying: React.FC<{x: number; y: number; rot: number; pose: Pose; uid: string; expr?: any; mouth?: any; look?: [number, number]; lidL?: number; lidR?: number; who?: string; s?: number}> = ({x, y, rot, pose, uid, expr = 'normal', mouth, look = [0.4, 0], lidL, lidR, who = 'hero', s = HS}) => (
	<g transform={`translate(${x},${y}) rotate(${rot})`}>
		<Actor who={who} x={0} floor={157 * s} s={s} facing={1} faceTurn={0.3} look={look} expr={expr} mouth={mouth} lidL={lidL} lidR={lidR} pose={pose} shadow={false} uid={uid} />
	</g>
);
// время игры в ночь 097–099: 23:42 → 23:53 за кадры 12327 → 12675
const nightMin = (gf: number) => interpolate(gf, [12327, 12675], [23 * 60 + 42, 23 * 60 + 53], clamp);
const roundLabel = (m: number) => {
	const t = m - (23 * 60 + 42);
	const segs: [number, number, string][] = [[0, 3, 'РАУНД 1'], [3, 4, 'ОТДЫХ'], [4, 7, 'РАУНД 2'], [7, 8, 'ОТДЫХ'], [8, 11, 'РАУНД 3']];
	const s = segs.find(([a, b]) => t >= a && t < b) ?? segs[4];
	const left = Math.max(0, (s[1] - t) * 60);
	return `${s[2]} · ${Math.floor(left / 60)}:${String(Math.floor(left % 60)).padStart(2, '0')}`;
};
const Cat: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => (
	<g transform={`translate(${x},${y})`}>
		<path d={`M60,-10 C110,-20 120,${-60 + Math.sin(f / 9) * 14} 96,-84`} stroke="#3a3a46" strokeWidth={14} fill="none" strokeLinecap="round" />
		<ellipse cx={0} cy={-30} rx={62} ry={40} fill="#4a4a58" stroke="#10132a" strokeWidth={4} />
		<circle cx={-34} cy={-84} r={36} fill="#4a4a58" stroke="#10132a" strokeWidth={4} />
		<polygon points="-62,-104 -56,-136 -38,-110" fill="#4a4a58" stroke="#10132a" strokeWidth={4} />
		<polygon points="-30,-110 -10,-134 -8,-100" fill="#4a4a58" stroke="#10132a" strokeWidth={4} />
		<circle cx={-46} cy={-88} r={6} fill="#ffe34a" />
		<circle cx={-24} cy={-88} r={6} fill="#ffe34a" />
		<ellipse cx={-34 + Math.sin(f / 30) * 3} cy={-88} rx={2} ry={5} fill="#10132a" />
	</g>
);

/* 094 «День двадцать второй. Две контрольные подряд» — падает на диван с учебником на лице */
const S94: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('094');
	const w = walkTo(e, 0, 54, -200, 1040, 1, 0.3);
	const fall = grow(e, 74, 18);
	const hx = interpolate(fall, [0, 1], [w.x, 1340]);
	const hy = interpolate(fall, [0, 1], [hip(HS), 772]);
	const rot = -84 * fall;
	const base = fall < 0.02 ? w.pose : blend(w.pose, {lean: 0, head: -4, armB: [10, 20], armF: [-10, 20], legB: [4, 2], legF: [-4, 2]}, fall);
	const head = rotPt(hx, hy, 0, -164 * HS, rot);
	const book = grow(e, 98, 8);
	const cam = usePush(camOn(960, 560, 1.15), camOn(1150, 610, 1.4));
	return (
		<Stage cam={cam} bg="#e9d8bd" light={{x: 20, y: 8, o: 0.4}}>
			<Layer depth={1.6}>
				<Room f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Couch x0={1000} x1={1560} />
					<Lying x={hx} y={hy} rot={rot} pose={base} uid="h94" expr={book > 0.5 ? 'sleepy' : 'worried'} />
					<g transform={`translate(${head[0] - 6},${head[1] - 12 - (1 - book) * 150}) rotate(${-8 + (1 - book) * 40})`} opacity={fall > 0.5 ? 1 : 0}>
						<rect x={-60} y={-36} width={120} height={78} rx={6} fill="#2f6fd8" stroke="#10132a" strokeWidth={5} />
						<rect x={-50} y={-26} width={100} height={12} fill="#f4f1e6" />
						<text x={0} y={30} textAnchor="middle" fontSize={26} fontFamily={FONT} fontWeight={800} fill="#fff">
							ФИЗИКА
						</text>
					</g>
					<HT x={head[0] + 20} s={1.15} auto bpm={78} yy={head[1] - 150} />
				</Svg>
			</Layer>
			<Led text="21:10" />
		</Stage>
	);
};

/* 095 + 096: «Открываешь глаза. 23:41.» — «Нет-нет-нет-нет!» — вскакивает, путается в пледе, падает, встаёт */
const S95: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('095');
	const j = f - at('096');
	const open = grow(e, 18, 6);
	const up = grow(j, 0, 8);
	const trip = env(j, 12, 34, 6, 6);
	const lieHx = 1340;
	const hx = interpolate(up, [0, 1], [lieHx, 1230]);
	const hy = interpolate(up, [0, 1], [772, hip(HS)]) + 18 * trip;
	const rot = -84 * (1 - up) + 70 * trip;
	const p: Pose = up < 0.5 ? {lean: 0, head: -4, armB: [10, 20], armF: [-10, 20], legB: [4, 2], legF: [-4, 2]} : blend({...idle(gf, 1), lean: 0}, {...idle(gf, 1), lean: 34, head: 12, armF: [-70, 20], armB: [-60, 20]}, Math.min(1, trip));
	const head = rotPt(hx, hy, 0, -164 * HS, rot);
	const book = grow(e, 10, 12);
	const cam = e < 70 ? usePush(camOn(1000, 330, 1.7), camOn(1100, 520, 1.05)) : camOn(1100, 520, 1.05 + 0.05 * up);
	return (
		<Stage cam={cam} bg="#262b48" light={{x: 20, y: 8, o: 0.3}}>
			<Layer depth={1.6}>
				<Room f={f} night />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<Clock x={1000} y={300} text="23:41" s={2.1} blink f={f} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Couch x0={1000} x1={1560} />
					<Lying x={hx} y={hy} rot={rot} pose={p} uid="h95" expr={open > 0.5 ? 'wide' : 'sleepy'} mouth={j > 0 ? 'open' : undefined} lidL={1 - open} lidR={1 - open} />
					{up < 0.1 ? (
						<g transform={`translate(${head[0] - 6 + 200 * book},${head[1] - 12 + 40 * book}) rotate(${-8 + 70 * book})`}>
							<rect x={-60} y={-36} width={120} height={78} rx={6} fill="#2f6fd8" stroke="#10132a" strokeWidth={5} />
						</g>
					) : null}
					{/* плед путается в ногах */}
					<g transform={`translate(${hx + 10},${FL - 30}) rotate(${trip * 20})`} opacity={up > 0.5 ? 1 : 0}>
						<rect x={-100} y={-24} width={200} height={50} rx={14} fill="#c9342a" stroke="#10132a" strokeWidth={4} />
						{[-60, -20, 20, 60].map((x) => <line key={x} x1={x} y1={-24} x2={x} y2={26} stroke="#f2c9a0" strokeWidth={5} />)}
					</g>
					<HT x={head[0] + 20} s={1.2} warn auto bpm={96} yy={head[1] - 150} />
					<Onoma x={hx - 200} y={hy - 260} text="НЕТ!" t={j - 2} c="#ff8a7a" rot={-8} size={70} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 097: подъезд, три раунда боя с тенью, кот смотрит */
const S97: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('097');
	const m = nightMin(gf);
	let hp = guard(idle(gf, 1), 1);
	for (let i = 0; i < 14; i++) {
		const st = 10 + i * 11;
		hp = hit(hp, i % 2 ? 'B' : 'F', 700, HS, 1, [820, 630 + (i % 3) * 20], env(e, st, st + 7, 2, 4));
	}
	const bob = Math.abs(Math.sin(e / 5)) * 7;
	const cam = usePush(camOn(900, 560, 1.15), camOn(980, 560, 1.35));
	return (
		<Stage cam={cam} bg="#2a3550" light={{x: 20, y: 5, o: 0.35}}>
			<Layer depth={1.6}>
				<Stairwell f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Cat x={1560} y={FL - 150} f={f} />
					<Actor who="hero" x={700} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.7, 0]} expr="angry" pose={hp} bob={bob} uid="h97" />
					<HT x={700} s={1.2} warn auto showBpm bpm={150} yy={tagY(HS) - bob} />
					{pill(1150, 300, roundLabel(m), '#7fe0ff', 1, 46)}
				</Svg>
			</Layer>
			<Led text={hm(m)} />
		</Stage>
	);
};

/* 098: крупно — губы считают шёпотом, сердце «150» бьётся */
const S98: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('098');
	const m = nightMin(gf);
	const n = 40 + Math.floor(e / 8);
	const cam = usePush(camOn(830, 540, 2.0), camOn(840, 535, 2.3));
	return (
		<Stage cam={cam} bg="#2a3550" light={{x: 20, y: 5, o: 0.35}}>
			<Layer depth={1.6}>
				<Stairwell f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={700} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.6, 0.3]} expr="worried" mouth={Math.sin(e / 2.2) > 0 ? 'open' : 'line'} pose={{...idle(gf, 1), lean: 8}} uid="h98" />
					<HT x={720} s={1.3} warn auto showBpm bpm={150} yy={tagY(HS) - 40} />
					{[0, 1, 2].map((i) => {
						const t = (e + i * 8) % 24;
						return <text key={i} x={800 + i * 26} y={560 - t * 6} fontSize={40} fontFamily={FONT} fontWeight={800} fill="#c8d0ea" opacity={Math.max(0, 1 - t / 24)}>{n - i}</text>;
					})}
				</Svg>
			</Layer>
			<Led text={hm(m)} />
		</Stage>
	);
};

/* 099: 23:53, щелчок, табличка зелёная, герой сползает по стене */
const S99: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('099');
	const slide = grow(e, 40, 26);
	const ok = e > 16;
	const seat = interpolate(slide, [0, 1], [hip(HS), FL - 34]);
	const p = blend({...idle(gf, 1), lean: -6}, {...FS, lean: -8}, slide);
	const cam = usePush(camOn(760, 560, 1.2), camOn(760, 640, 1.45));
	return (
		<Stage cam={cam} bg="#2a3550" light={{x: 20, y: 5, o: 0.35}}>
			<Layer depth={1.6}>
				<Stairwell f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					{shadow(700, 1 + slide)}
					<Actor who="hero" x={700} floor={FL} seat={seat} s={HS} facing={1} faceTurn={0.4} look={[0.4, 0.2]} expr={slide > 0.5 ? 'sleepy' : 'wide'} mouth={slide > 0.5 ? 'smile' : undefined} pose={p} uid="h99" />
					<HT x={720} s={1.2} ok={ok} auto showBpm bpm={slide > 0.5 ? 110 : 150} yy={seat - 164 * HS - 125} pop={1 + 0.25 * Math.exp(-Math.max(0, e - 16) / 5) * (ok ? 1 : 0)} />
					{ok && e < 38 ? <circle cx={720} cy={seat - 164 * HS - 125} r={50 + (e - 16) * 9} fill="none" stroke="#5fe08a" strokeWidth={8 * Math.max(0, 1 - (e - 16) / 22)} opacity={Math.max(0, 1 - (e - 16) / 22)} /> : null}
					<Onoma x={900} y={540} text="ЩЁЛК" t={e - 16} c="#5fe08a" rot={-6} size={60} />
				</Svg>
			</Layer>
			<Led text="23:53" />
		</Stage>
	);
};

/* 100: на следующий день дед молча рисует пальцем в воздухе «00:02» */
const S100: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('100');
	const draw = grow(e, 40, 60);
	const gp = reach(idle(gf, 5), 'F', toLocal(1010 + 140 * draw, 470 + 20 * Math.sin(e / 4), 1130, hip(1), 1, -1), grow(e, 24, 10));
	const cam = usePush(camOn(930, 560, 1.2), camOn(1010, 520, 1.4));
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={640} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.9, 0]} expr="normal" mouth="smile" pose={idle(gf, 1)} uid="h100" />
					<HT x={650} s={1.15} auto bpm={78} />
					<Actor who="grandpa" x={1130} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.6, -0.3]} expr="normal" pose={gp} handF="point" uid="g100" />
					<Tag x={1130} y={tagY(1)} value={1400} f={f} s={1.0} bpm={65} />
					<g opacity={grow(e, 34, 10)} style={{filter: 'drop-shadow(0 0 10px #7fe0ff)'}}>
						<clipPath id="g100c">
							<rect x={940} y={380} width={Math.max(1, 360 * draw)} height={160} />
						</clipPath>
						<text x={950} y={500} fontSize={130} fontFamily={FONT} fontWeight={900} fill="#7fe0ff" clipPath="url(#g100c)">
							00:02
						</text>
					</g>
				</Svg>
			</Layer>
			<Led text="19:20" />
		</Stage>
	);
};

/* 101: сепия — молодой дед на ринге, часы 00:02, табличка в ноль; затем «1 400» */
const S101: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('101');
	const burn = grow(e, 70, 24);
	const now = e >= 124;
	const jab = env(e, 20, 60, 5, 6) * (e % 20 < 10 ? 1 : 0.5);
	let yp = guard(idle(gf, 5), 0.8);
	yp = hit(yp, 'F', 900, 1, 1, [1030, 640], jab);
	const cam = usePush(camOn(960, 560, 1.15), camOn(980, 540, 1.35));
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} ring />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<Clock x={960} y={220} text={now ? '19:20' : '00:02'} s={1.5} f={f} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					{now ? (
						<g>
							<Actor who="grandpa" x={900} floor={FL} s={1} facing={1} faceTurn={0.5} look={[0.8, 0]} expr="normal" mouth="smile" pose={idle(gf, 5)} uid="g101n" />
							<Tag x={900} y={tagY(1)} value={1400} f={f} s={1.15 * grow(e, 124, 8)} bpm={65} />
						</g>
					) : (
						<g>
							<Actor who="ygpa" x={900} floor={FL} s={1} facing={1} faceTurn={0.5} look={[0.8, 0]} expr={burn > 0.5 ? 'sad' : 'normal'} pose={yp} uid="g101" />
							{burn < 1 ? <Tag x={900} y={tagY(1)} value={0} f={f} s={0.01} heart={false} /> : null}
							{burn >= 0.98 ? <Tag x={900} y={tagY(1)} value={0} f={f} s={1.15} heart={false} /> : null}
							{burn > 0 && burn < 0.98 ? Array.from({length: 14}).map((_, i) => <circle key={i} cx={900 + Math.sin(i * 7) * 70 * burn} cy={tagY(1) + burn * (90 + (i % 5) * 30)} r={9 - burn * 5} fill="#9a9a9a" opacity={1 - burn} />) : null}
						</g>
					)}
				</Svg>
			</Layer>
			{now ? null : <div style={{position: 'absolute', inset: 0, background: 'rgba(150,105,50,0.55)', mixBlendMode: 'multiply'}} />}
		</Stage>
	);
};

/* 102: мелом «ПРАВИЛО 4: ЗАКОНЧИТЬ ДО 00:00»; часы 23:59 → 00:00 */
const S102: React.FC = () => {
	const {f, at} = useShot();
	const e = f - at('102');
	const z = e > 74;
	return (
		<Board tint="#1d3a33">
			<Chalk x={960} y={190} text="ПРАВИЛО 4:" k={grow(e, 4, 26)} size={110} anchor="middle" />
			<Chalk x={960} y={360} text="ЗАКОНЧИТЬ" k={grow(e, 26, 24)} size={130} anchor="middle" c="#ffd34a" />
			<Chalk x={960} y={520} text="ДО 00:00" k={grow(e, 46, 22)} size={130} anchor="middle" c="#ffd34a" />
			<g transform="translate(960,760)">
				<rect x={-250} y={-100} width={500} height={170} rx={20} fill="#10141f" stroke="#2c3646" strokeWidth={8} />
				<text y={50} textAnchor="middle" fontSize={140} fontFamily={FONT} fontWeight={800} fill="#ff4a3a" style={{filter: 'drop-shadow(0 0 12px #ff4a3a)'}}>
					{z ? '00:00' : '23:59'}
				</text>
			</g>
		</Board>
	);
};

/* ================= ЧАСТЬ 8 (начало) ================= */
const sisPose = (gf: number) => idle(gf, 6);

/* 103: школа, сестра в костюме за кулисами волнуется */
const S103: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('103');
	const w = walkTo(e, 0, 400, 560, 960, 3, 0.05);
	const pace = Math.sin(e / 20);
	const x = 760 + pace * 120;
	const p = gesture('handsOnHead', idle(gf, 6), grow(e, 100, 14) * (Math.sin(e / 30) > 0 ? 1 : 0.4), f);
	const cam = usePush(camOn(840, 600, 1.5), camOn(820, 590, 1.9));
	return (
		<Stage cam={cam} bg="#241a36" light={{x: 50, y: 5, o: 0.3}}>
			<Layer depth={1.6}>
				<ConcertHall f={f} open={0} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="sis" x={x} floor={FL} s={0.85} facing={pace > 0 ? 1 : -1} faceTurn={0.4} look={[0, 0.2]} expr="worried" mouth="flat" pose={p} uid="s103" />
					<polygon points={`${x},${FL - 157 * 0.85 + 20} ${x + 26},${FL - 157 * 0.85 + 60} ${x},${FL - 157 * 0.85 + 100} ${x - 26},${FL - 157 * 0.85 + 60}`} fill="#ffd34a" stroke="#10132a" strokeWidth={3} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 104: сестра на сцене ищет глазами в зале, находит героя, машет */
const S104: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('104');
	const scan = Math.sin(e / 12) * (1 - grow(e, 90, 8));
	const found = grow(e, 90, 8);
	const wave = gesture('wave', idle(gf, 6), found, f);
	const hw = gesture('wave', idle(gf, 1), grow(e, 112, 8), f);
	const cam = e < 80 ? usePush(camOn(960, 520, 1.1), camOn(960, 540, 1.3)) : usePush(camOn(1100, 600, 1.35), camOn(1250, 700, 1.9));
	return (
		<Stage cam={cam} bg="#241a36" light={{x: 50, y: 5, o: 0.3}}>
			<Layer depth={1.6}>
				<ConcertHall f={f} open={1} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="sis" x={960} floor={560} s={0.9} facing={1} faceTurn={0.4} look={[found > 0.5 ? 0.9 : scan, 0.4]} expr={found > 0.5 ? 'normal' : 'worried'} mouth={found > 0.5 ? 'smile' : undefined} pose={wave} shadow={false} uid="s104" />
					<Extra i={2} x={420} floor={1020} s={0.95} pose={idle(gf, 2)} seed="aud" />
					<Extra i={4} x={700} floor={1020} s={0.95} pose={idle(gf, 4)} seed="aud" />
					<Actor who="hero" x={1380} floor={1020} s={0.95} facing={-1} faceTurn={0.4} look={[-0.5, -0.4]} expr="normal" mouth={found > 0.5 ? 'smile' : undefined} pose={hw} uid="h104" />
					<HT x={1390} s={1.1} auto bpm={78} yy={1020 - 157 * 0.95 - 164 * 0.95 - 115} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 105: сестра поёт, зажмурившись; герой встаёт и хлопает громче всех, соседи оборачиваются */
const S105: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('105');
	const stand = grow(e, 50, 10);
	const clap = Math.abs(Math.sin(e / 3)) * stand;
	let hp = idle(gf, 1);
	hp = reach(reach(hp, 'F', [44, -110 + clap * 6], stand), 'B', [44 - clap * 40, -108], stand);
	const turn = grow(e, 70, 10);
	const cam = e < 55 ? usePush(camOn(960, 540, 1.3), camOn(960, 540, 1.6)) : camOn(1050, 700, 1.3);
	return (
		<Stage cam={cam} bg="#241a36" light={{x: 50, y: 5, o: 0.3}}>
			<Layer depth={1.6}>
				<ConcertHall f={f} open={1} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="sis" x={960} floor={560} s={0.9} facing={1} faceTurn={0.3} look={[0, 0]} expr="sleepy" mouth="open" pose={{...idle(gf, 6), armF: [30, 40], armB: [-30, 40]}} lidL={1} lidR={1} shadow={false} uid="s105" />
					<Extra i={2} x={600} floor={1020} s={0.95} facing={turn > 0.5 ? -1 : 1} pose={idle(gf, 2)} seed="aud" />
					<Extra i={4} x={1160} floor={1020} s={0.95} facing={turn > 0.5 ? 1 : -1} pose={idle(gf, 4)} seed="aud" />
					<Actor who="hero" x={1380 - 70 * (1 - stand)} floor={1020 - 0} s={0.95} facing={-1} faceTurn={0.4} look={[-0.5, -0.3]} expr="normal" mouth="smile" pose={hp} uid="h105" bob={stand * 6} />
					<HT x={1390} s={1.1} auto bpm={88} yy={1020 - 157 * 0.95 - 164 * 0.95 - 115 - 20 * stand} />
					<Onoma x={1250} y={640} text="БРАВО" t={e - 56} c="#ffd34a" rot={-6} size={56} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 106: часы 19:00 → 21:00; двери зала с табличкой «ЗАКРЫТО» */
const S106: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('106');
	const m = interpolate(e, [10, 110], [19 * 60, 21 * 60], clamp);
	const cam = usePush(camOn(920, 540, 1.1), camOn(1010, 540, 1.3));
	return (
		<Stage cam={cam} bg="#3b4a78" light={{x: 70, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<BoxStreet f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<g transform="translate(1050,560) rotate(-4)">
						<rect x={-130} y={-44} width={260} height={88} rx={10} fill="#e2483a" stroke="#10132a" strokeWidth={5} />
						<text y={20} textAnchor="middle" fontSize={56} fontFamily={FONT} fontWeight={900} fill="#fff" opacity={grow(e, 100, 8)}>
							ЗАКРЫТО
						</text>
					</g>
					<Actor who="hero" x={780} floor={FL} s={HS} facing={-1} faceTurn={0.4} look={[-0.8, 0]} expr="normal" mouth="smile" pose={idle(gf, 1)} uid="h106" />
					<HT x={790} s={1.15} auto bpm={78} />
					<Actor who="sis" x={640} floor={FL} s={0.85} facing={-1} faceTurn={0.4} look={[-0.8, 0]} expr="normal" mouth="smile" pose={idle(gf, 6)} uid="s106" />
				</Svg>
			</Layer>
			<Led text={hm(m)} size={110} />
		</Stage>
	);
};

/* 107: сестра спит на диване, герой у окна */
const S107: React.FC = () => {
	const {f, gf, at} = useShot();
	const cam = usePush(camOn(1000, 560, 1.15), camOn(1080, 580, 1.35));
	return (
		<Stage cam={cam} bg="#262b48" light={{x: 20, y: 8, o: 0.3}}>
			<Layer depth={1.6}>
				<Room f={f} night />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Couch x0={1000} x1={1560} />
					<Lying x={1340} y={780} rot={-84} pose={{lean: 0, head: -4, armB: [10, 20], armF: [-10, 20], legB: [4, 2], legF: [-4, 2]}} uid="s107" who="sis" s={0.85} expr="sleepy" />
					<rect x={1320} y={745} width={240} height={44} rx={16} fill="#c9342a" opacity={0.9} />
					<Actor who="hero" x={640} floor={FL} s={HS} facing={-1} faceTurn={0.5} look={[-0.9, -0.2]} expr="normal" pose={gesture('armsCrossed', idle(gf, 1), 0.8, f)} uid="h107" />
					<HT x={650} s={1.15} auto bpm={80} />
				</Svg>
			</Layer>
			<Led text="22:40" />
		</Stage>
	);
};

/* 108: 23:00, мама дома; герой бинтует руки; «11 минут — и счётчик спасён» */
const S108: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('108');
	const wr = Math.sin(e / 5);
	let hp = idle(gf, 1);
	hp = reach(reach(hp, 'F', [40 + wr * 6, -80], 1), 'B', [34 - wr * 6, -84], 1);
	const mw = walkTo(e, 0, 24, 2200, 1640, 5, 0.3);
	const cam = usePush(camOn(1100, 520, 1.1), camOn(1100, 540, 1.25));
	return (
		<Stage cam={cam} bg="#262b48" light={{x: 20, y: 8, o: 0.3}}>
			<Layer depth={1.6}>
				<Room f={f} night />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<Clock x={960} y={180} text="23:00" s={1.5} blink f={f} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={800} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.7, 0.4]} expr="normal" pose={hp} uid="h108" />
					<rect x={800 + 38 * HS} y={hip(HS) - 100} width={46} height={30} rx={10} fill="#f2efe6" stroke="#10132a" strokeWidth={3} />
					<HT x={810} s={1.2} warn auto bpm={82} showBpm />
					<Actor who="mom" x={mw.x} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.8, 0]} expr="normal" mouth={e > 40 ? 'smile' : undefined} pose={mw.pose} vx={mw.vx} bob={mw.bob} uid="m108" />
					{pill(1250, 340, 'НУЖНО 11:00', '#7fe0ff', grow(e, 100, 10), 60)}
				</Svg>
			</Layer>
		</Stage>
	);
};

export const PART78A: ShotDef[] = [
	{at: '094', C: S94, whip: true},
	{at: '095', C: S95},
	{at: '097', C: S97, whip: true},
	{at: '098', C: S98},
	{at: '099', C: S99},
	{at: '100', C: S100, whip: true},
	{at: '101', C: S101},
	{at: '102', C: S102, own: true, ownCuts: []},
	{at: '103', C: S103, whip: true},
	{at: '104', C: S104},
	{at: '105', C: S105},
	{at: '106', C: S106, whip: true},
	{at: '107', C: S107, whip: true},
	{at: '108', C: S108},
];
