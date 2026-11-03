import React from 'react';
import {interpolate} from 'remotion';
import {Pose, rigPoints, toLocal} from '../engine/Stickman';
import {blend, env, gesture, idle, reach, walk, walkTo} from '../kit/actions';
import {Actor, counterAt, useShot, useSpeaking} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {HeroBadge, Layer, Stage, Svg, camOn, clamp, ease, usePush} from '../kit/kit';
import {Callout} from '../kit/graphics';
import {Bedroom, Blanket} from '../kit/sets';
import {Sleeper} from '../kit/kit';
import {Bubble, Board, FONT} from '../kit/ui';
import {Onoma} from '../reference/PauseTime';
import {BoxStreet, Cinema, Clock, Facade, Gym, Heart, Room, Tag} from './places';
import {FL, HS, HT, Rope, grow, guard, hands, hip, hit, tagY} from './common';
import {SEAT, FS, hand, pill, shadow, Chalk, heartPath} from './shots2';

/* Части 4, 5 и 6 (реплики 060–093). Табличка героя: счётчик ролика; «ПАУЗА 14» и «ДЕНЬ 15» у Тёмы рисуются сценами.
   Пульс: покой 80 серое, считается ≥150 красное, ровный бег 125 жёлтое. */
const pads0: [number, number][] = [[945, 600], [955, 668]];
const Pad: React.FC<{p: [number, number]; a?: number}> = ({p, a = 0}) => (
	<rect x={p[0] - 15} y={p[1] - 27} width={36} height={54} rx={11} fill="#e2483a" stroke="#7a1812" strokeWidth={4} transform={`rotate(${a} ${p[0]} ${p[1]})`} />
);
const trainerPads = (p: Pose, x: number, ps: [number, number][]) => reach(reach(p, 'F', toLocal(ps[0][0], ps[0][1], x, hip(1.02), 1.02, -1), 1), 'B', toLocal(ps[1][0], ps[1][1], x, hip(1.02), 1.02, -1), 1);
const dark = (c: string) => c;

/* ================= ЧАСТЬ 4 ================= */

/* 060 TRAINER: «Локоть! Подбородок! Дыши!» — герой бьёт мимо, лапа сама прыгает к кулаку */
const S60: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('060');
	const per = 19;
	let hp = guard(idle(gf, 1), 1);
	const sh: [number, number][] = [[0, 0], [0, 0]];
	for (let i = 0; i < 6; i++) {
		const st = 10 + i * per;
		const miss = i % 2 === 0;
		const t: [number, number] = [pads0[i % 2][0] + (miss ? -70 : 0), pads0[i % 2][1] + (miss ? 45 : 0)];
		hp = hit(hp, i % 2 ? 'B' : 'F', 850, HS, 1, t, env(e, st, st + 10, 3, 5));
		if (miss) {
			sh[i % 2][0] += -70 * env(e, st + 4, st + 20, 3, 8);
			sh[i % 2][1] += 45 * env(e, st + 4, st + 20, 3, 8);
		}
	}
	const ps = pads0.map((p, i) => [p[0] + sh[i][0], p[1] + sh[i][1] + Math.sin((e + i * 9) / 7) * 6] as [number, number]);
	const tp = trainerPads(idle(gf, 3), 1000, ps);
	const shout = env(e, 0, 40, 4, 8);
	const cam = usePush(camOn(895, 570, 1.3), camOn(905, 565, 1.6));
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={850} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.8, 0.3]} expr="worried" pose={hp} uid="h60" />
					<HT x={850} s={1} auto showBpm bpm={140} />
					<Actor who="trainer" x={1000} floor={FL} s={1.02} facing={-1} faceTurn={0.5} look={[-0.8, 0]} mouth={shout > 0.5 ? 'open' : undefined} pose={tp} uid="t60" />
					{ps.map((p, i) => <Pad key={i} p={p} a={-8} />)}
					<Onoma x={900} y={760} text="МИМО" t={e - 16} c="#ff8a7a" rot={-6} size={48} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 061: сплит «ДЕНЬ 5 / ДЕНЬ 12» — те же тонкие руки, слева мимо, справа точно; выноска «РУКИ ТЕ ЖЕ» */
const S61: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('061');
	const panel = (cx: number, day: number, good: boolean, uid: string) => {
		const s = 1.2;
		let p = guard(idle(gf, good ? 2 : 1), 1);
		const per = good ? 11 : 20;
		const tgt: [number, number] = [cx + 150, 620];
		for (let i = 0; i < 9; i++) {
			const st = 16 + i * per;
			const t: [number, number] = good ? tgt : [tgt[0] - 50 + (i % 3) * 30, tgt[1] + 60 - (i % 2) * 90];
			p = hit(p, i % 2 ? 'B' : 'F', cx, s, 1, t, env(e, st, st + (good ? 6 : 11), 2, 4));
		}
		return (
			<g>
				<circle cx={tgt[0]} cy={tgt[1]} r={34} fill="none" stroke="#ffd34a" strokeWidth={6} opacity={0.85} />
				<circle cx={tgt[0]} cy={tgt[1]} r={9} fill="#ffd34a" />
				{shadow(cx, 1.2)}
				<Actor who="hero" x={cx} floor={FL} s={s} facing={1} faceTurn={0.4} look={[0.8, 0]} expr="normal" pose={p} uid={uid} />
				<Tag x={cx} y={150} value={day} f={f} s={1.6} heart={false} />
			</g>
		);
	};
	const k = grow(e, 30, 12);
	return (
		<Board tint="#1a2150">
			{panel(480, 5, false, 'h61a')}
			{panel(1440, 12, true, 'h61b')}
			<line x1={960} y1={0} x2={960} y2={1080} stroke="#fff" strokeWidth={6} opacity={0.5} />
			{pill(960, 990, 'РУКИ ТЕ ЖЕ', '#ffd34a', k, 56)}
			<text x={960} y={560} textAnchor="middle" fontSize={120} fontFamily={FONT} fontWeight={900} fill="#ffd34a" opacity={k}>
				=
			</text>
		</Board>
	);
};

/* 062: «МОЗГ УЧИТСЯ» — молнии бегут от головы к кулаку, в углу «Moritani & deVries, 1979» */
const S62: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('062');
	const per = 16;
	let hp = guard(idle(gf, 1), 1);
	let hit_ = 0;
	for (let i = 0; i < 12; i++) {
		const st = 40 + i * per;
		const k = env(e, st, st + 9, 3, 5);
		hp = hit(hp, i % 2 ? 'B' : 'F', 850, HS, 1, pads0[i % 2], k);
		hit_ = Math.max(hit_, env(e, st - 8, st + 6, 3, 3));
	}
	const h = hands(hp, 850, HS, 1);
	const hd = rigPoints(hp).head;
	const head: [number, number] = [850 + hd[0] * HS, hip(HS) + hd[1] * HS];
	const fist = e % per < 8 ? h.f : h.b;
	const bolt = (seed: number) => {
		const n = 7;
		return Array.from({length: n + 1}).map((_, i) => {
			const t = i / n;
			const jx = i === 0 || i === n ? 0 : Math.sin(e * 1.7 + i * 2.3 + seed) * 26;
			const jy = i === 0 || i === n ? 0 : Math.cos(e * 1.3 + i * 1.9 + seed) * 18;
			return `${i === 0 ? 'M' : 'L'}${head[0] + (fist[0] - head[0]) * t + jx},${head[1] + (fist[1] - head[1]) * t + jy}`;
		}).join(' ');
	};
	const tp = trainerPads(idle(gf, 3), 1000, pads0);
	const pl = grow(e, 8, 10);
	const cam = usePush(camOn(900, 560, 1.35), camOn(890, 540, 1.6));
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={850} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.8, 0]} expr="angry" pose={hp} uid="h62" />
					<Actor who="trainer" x={1000} floor={FL} s={1.02} facing={-1} faceTurn={0.5} look={[-0.8, 0]} pose={tp} uid="t62" />
					{pads0.map((p, i) => <Pad key={i} p={p} a={-8} />)}
					{[0, 1, 2].map((sd) => (
						<g key={sd} opacity={0.35 + 0.65 * hit_}>
							<path d={bolt(sd * 3)} stroke="#10132a" strokeWidth={14} fill="none" strokeLinejoin="round" strokeLinecap="round" />
							<path d={bolt(sd * 3)} stroke="#7fe0ff" strokeWidth={7} fill="none" strokeLinejoin="round" strokeLinecap="round" />
						</g>
					))}
					<HT x={850} s={1} auto showBpm bpm={150} />
					{pill(850, 300, 'МОЗГ УЧИТСЯ', '#7fe0ff', pl, 46)}
				</Svg>
			</Layer>
			<div style={{position: 'absolute', right: 56, bottom: 44, color: '#c8d0ea', fontFamily: FONT, fontSize: 30, fontWeight: 600, opacity: grow(e, 70, 14), textShadow: '0 2px 6px #000'}}>Moritani &amp; deVries, 1979</div>
		</Stage>
	);
};

/* 063: «День двенадцатый. Хлоп — и тренер впервые кивает» */
const S63: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('063');
	const st = 30;
	let hp = guard(idle(gf, 1), 1);
	hp = hit(hp, 'F', 850, HS, 1, pads0[0], env(e, st, st + 9, 3, 6));
	const nod = env(e, st + 14, st + 30, 5, 6) + env(e, st + 36, st + 50, 5, 6);
	let tp = trainerPads(idle(gf, 3), 1000, pads0);
	tp = {...tp, head: tp.head + 16 * Math.min(1, nod)};
	const cam = usePush(camOn(900, 560, 1.45), camOn(930, 555, 1.75));
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={850} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.8, 0]} expr="normal" mouth={e > st + 12 ? 'smile' : undefined} pose={hp} uid="h63" />
					<HeroBadge x={850} y={tagY(HS)} s={1} />
					<Heart x={1010} y={tagY(HS) - 4} f={f} bpm={140} s={1} c="#ff4a5e" />
					<Actor who="trainer" x={1000} floor={FL} s={1.02} facing={-1} faceTurn={0.5} look={[-0.8, 0.2]} mouth={nod > 0.5 ? 'smirk' : undefined} pose={tp} uid="t63" />
					{pads0.map((p, i) => <Pad key={i} p={p} a={-8} />)}
					<Onoma x={925} y={640} text="ХЛОП!" t={e - (st + 5)} c="#ffd34a" rot={-8} size={70} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ================= ЧАСТЬ 5 ================= */
const SCARF = '#c9342a';
const Scarf: React.FC<{p: Pose; x: number; s: number; facing: 1 | -1; bob?: number}> = ({p, x, s, facing, bob = 0}) => {
	const hd = rigPoints(p).head;
	const hx = x + hd[0] * s * facing;
	const hy = hip(s) + hd[1] * s - bob * s;
	return (
		<g>
			<rect x={hx - 36 * s} y={hy + 52 * s} width={72 * s} height={22 * s} rx={11 * s} fill={SCARF} stroke="#10132a" strokeWidth={3} />
			{[-24, -8, 8, 24].map((dx) => <line key={dx} x1={hx + dx * s} y1={hy + 54 * s} x2={hx + dx * s} y2={hy + 72 * s} stroke="#fff" strokeWidth={4} opacity={0.8} />)}
			<rect x={hx - 40 * s * facing} y={hy + 66 * s} width={16 * s} height={56 * s} rx={7 * s} fill={SCARF} stroke="#10132a" strokeWidth={3} />
			<circle cx={hx + 34 * s * facing} cy={hy + 8 * s} r={9 * s} fill="#ff5a4a" stroke="#10132a" strokeWidth={2} />
		</g>
	);
};

/* 064: градусник «38,2», герой под одеялом, «ДЕНЬ 15» мигает */
const S64: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('064');
	const merc = grow(e, 8, 50);
	const temp = 36.6 + (38.2 - 36.6) * merc;
	const cam = usePush(camOn(1100, 520, 1.2), camOn(1300, 540, 1.5));
	return (
		<Stage cam={cam} bg="#a9cfe0" light={{x: 45, y: 20, o: 0.5}}>
			<Layer depth={1.4}>
				<Bedroom f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Sleeper x={1500} y={700} s={1} expr="sleepy" />
					<Blanket f={gf} />
					<Tag x={1420} y={540} value={counterAt(gf)} f={f} s={1.15} warn heart auto showBpm bpm={92} />
					<g transform="translate(900,570) rotate(-18)">
						<rect x={-24} y={-190} width={48} height={380} rx={24} fill="#f4f8ff" stroke="#10132a" strokeWidth={6} />
						<rect x={-10} y={140 - 300 * merc} width={20} height={50 + 300 * merc} rx={10} fill="#e2483a" />
						<circle cx={0} cy={192} r={30} fill="#e2483a" stroke="#10132a" strokeWidth={6} />
						{[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={14} y1={-150 + i * 50} x2={32} y2={-150 + i * 50} stroke="#10132a" strokeWidth={4} />)}
					</g>
					<text x={900} y={400} textAnchor="middle" fontSize={140} fontFamily={FONT} fontWeight={900} fill="#c9342a" stroke="#fff" strokeWidth={10} paintOrder="stroke">
						{temp.toFixed(1).replace('.', ',')}
					</text>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 065: герой бредёт по улице в шарфе, шмыгает, табличка 15 мигает */
const S65: React.FC = () => {
	const {f, at} = useShot();
	const e = f - at('065');
	const w = walkTo(e, 0, 165, 300, 1500, 2, 0.16);
	const p: Pose = {...w.pose, lean: w.pose.lean + 6, head: w.pose.head + 8};
	const cam = camOn(w.x + 200, 560, 1.45);
	return (
		<Stage cam={cam} bg="#3b4a78" light={{x: 70, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<BoxStreet f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={w.x} floor={FL} s={HS} facing={1} faceTurn={0.3} look={[0.5, 0.5]} expr="sleepy" mouth="frown" pose={p} vx={w.vx} bob={w.bob * 0.5} uid="h65" />
					<Scarf p={p} x={w.x} s={HS} facing={1} bob={w.bob * 0.5} />
					<HT x={w.x + 10} s={1} warn auto bpm={92} showBpm yy={tagY(HS) - 4} />
					<Onoma x={w.x + 80} y={560} text="ШМЫГ" t={(e % 60) - 4} c="#ffd34a" rot={-6} size={46} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 066 TRAINER + 067 HERO + 068 TRAINER: «С температурой — домой», хватается за табличку, «Сгорит — начнёшь заново» */
const S66: React.FC = () => {
	const {f, gf, at} = useShot();
	const sp = useSpeaking(gf);
	const e = f - at('066');
	const turn = grow(e, 10, 14);
	const grab = grow(f, at('067') + 2, 8);
	const point = grow(f, at('068'), 8);
	const hx = 800;
	let hp = idle(gf, 1);
	let tp = idle(gf, 3);
	const tx = 1000;
	tp = hand(hand(tp, tx, 1.02, -1, 'F', [hx + 24, hip(HS) - 130], 1 - grab), tx, 1.02, -1, 'B', [hx + 24, hip(HS) - 130], 1 - grab);
	tp = gesture('point', tp, point, gf);
	const tagPos: [number, number] = [hx + 10, tagY(HS)];
	hp = hand(hand(hp, hx, HS, turn > 0.5 ? -1 : 1, 'F', [tagPos[0] - 30, tagPos[1] + 40], grab), hx, HS, turn > 0.5 ? -1 : 1, 'B', [tagPos[0] + 30, tagPos[1] + 40], grab);
	const face = turn > 0.5 ? -1 : 1;
	const cam = sp === 'TRAINER' ? camOn(950, 560, 1.55) : sp === 'HERO' ? camOn(820, 520, 1.7) : camOn(900, 560, 1.2);
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<rect x={200} y={470} width={190} height={430} fill="#1c2438" />
					<rect x={214} y={484} width={162} height={416} fill="#35466e" />
					<circle cx={355} cy={700} r={9} fill="#ffd34a" />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={hx} floor={FL} s={HS} facing={face as 1 | -1} faceTurn={0.4} look={[face * 0.8, 0]} expr={grab > 0.5 ? 'wide' : 'sleepy'} mouth={grab > 0.5 ? 'open' : 'frown'} pose={hp} uid="h66" />
					<Scarf p={hp} x={hx} s={HS} facing={face as 1 | -1} />
					<HT x={hx + 10} s={1} warn auto bpm={92} showBpm yy={tagY(HS)} />
					<Actor who="trainer" x={tx} floor={FL} s={1.02} facing={-1} faceTurn={0.6} look={[-0.9, 0]} expr={point > 0.5 ? 'angry' : 'normal'} pose={tp} uid="t66" handF={point > 0.5 ? 'point' : undefined} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 069: полночь — табличка не сгорает, а становится серой «ПАУЗА 14», снежинка */
const S69: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('069');
	const sw = grow(e, 50, 6);
	const ring = grow(e, 50, 22);
	const cam = usePush(camOn(1200, 500, 1.2), camOn(1330, 520, 1.55));
	return (
		<Stage cam={cam} bg="#1d2550" light={{x: 45, y: 20, o: 0.3, night: true}}>
			<Layer depth={1.4}>
				<Bedroom f={gf} night />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Sleeper x={1500} y={700} s={1} expr="sleepy" />
					<Blanket f={gf} night />
					<Clock x={880} y={560} text="00:00" s={1} f={f} />
					<Tag x={1420} y={520} value={sw > 0.5 ? 14 : 15} label={sw > 0.5 ? 'ПАУЗА' : 'ДЕНЬ'} f={f} s={1.3} grey={sw > 0.5} warn={sw <= 0.5} heart={false} />
					{sw > 0.5 ? (
						<g transform={`translate(${1420 + 190},${520 - 10}) scale(${0.8 + 0.2 * sw}) rotate(${e * 1.2})`}>
							{[0, 60, 120].map((a) => <line key={a} x1={0} y1={-34} x2={0} y2={34} stroke="#cfe6ff" strokeWidth={7} strokeLinecap="round" transform={`rotate(${a})`} />)}
						</g>
					) : null}
					{ring > 0 && ring < 1 ? <circle cx={1420} cy={520} r={50 + ring * 150} fill="none" stroke="#cfe6ff" strokeWidth={8 * (1 - ring)} opacity={1 - ring} /> : null}
					<Onoma x={1280} y={420} text="ДЗЫНЬ" t={e - 52} c="#cfe6ff" rot={-8} size={60} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 070: сплит — у героя и Тёмы две серые «14», потом две жёлтые «15»; календарь листает три дня */
const S70: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('070');
	const back = grow(e, 120, 8);
	const days = [16, 17, 18];
	const side = (cx: number, who: 'hero' | 'tema', uid: string) => (
		<g>
			<Tag x={cx} y={190} value={back > 0.5 ? 15 : 14} label={back > 0.5 ? 'ДЕНЬ' : 'ПАУЗА'} f={f} s={1.7} grey={back <= 0.5} heart={false} />
			{back <= 0.5 ? null : <circle cx={cx} cy={190} r={60 + (e - 124) * 8} fill="none" stroke="#ffe08a" strokeWidth={8} opacity={Math.max(0, 1 - (e - 124) / 14)} />}
			{shadow(cx, 1.2)}
			<Actor who={who} x={cx} floor={FL} s={who === 'hero' ? HS : 1} facing={1} faceTurn={0.3} look={[0.4, 0.2]} expr={back > 0.5 ? 'normal' : 'sleepy'} mouth={back > 0.5 ? 'smile' : 'frown'} pose={idle(gf, who === 'hero' ? 1 : 4)} uid={uid} />
		</g>
	);
	return (
		<Board tint="#1a2150">
			{side(480, 'hero', 'h70a')}
			{side(1440, 'tema', 't70b')}
			<line x1={960} y1={0} x2={960} y2={1080} stroke="#fff" strokeWidth={6} opacity={0.5} />
			{days.map((d, i) => {
				const t = e - (30 + i * 30);
				const k = interpolate(t, [0, 8, 24, 32], [0, 1, 1, 0], clamp);
				return (
					<g key={d} transform={`translate(960,${520 - (1 - k) * 40}) rotate(${(i - 1) * 6})`} opacity={k}>
						<rect x={-90} y={-100} width={180} height={200} rx={14} fill="#fff" stroke="#10132a" strokeWidth={6} />
						<rect x={-90} y={-100} width={180} height={52} rx={14} fill="#e2483a" />
						<text y={64} textAnchor="middle" fontSize={96} fontFamily={FONT} fontWeight={900} fill="#10132a">
							{d}
						</text>
					</g>
				);
			})}
		</Board>
	);
};

/* 071: все три дня герой под одеялом смотрит на серую табличку; часы крутятся */
const S71: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('071');
	const ang = e * 14;
	const cam = usePush(camOn(1150, 500, 1.15), camOn(1250, 500, 1.4));
	return (
		<Stage cam={cam} bg="#1d2550" light={{x: 45, y: 20, o: 0.3, night: true}}>
			<Layer depth={1.4}>
				<Bedroom f={gf} night />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Sleeper x={1500} y={700} s={1} expr="worried" />
					<Blanket f={gf} night />
					<g transform="translate(880,420)">
						<circle r={150} fill="#f2efe6" stroke="#10141f" strokeWidth={12} />
						{Array.from({length: 12}).map((_, i) => <line key={i} x1={0} y1={-124} x2={0} y2={-140} stroke="#10141f" strokeWidth={7} transform={`rotate(${i * 30})`} />)}
						<line x1={0} y1={0} x2={0} y2={-100} stroke="#10141f" strokeWidth={10} strokeLinecap="round" transform={`rotate(${ang})`} />
						<line x1={0} y1={0} x2={0} y2={-70} stroke="#c9342a" strokeWidth={12} strokeLinecap="round" transform={`rotate(${ang / 12})`} />
					</g>
					<Tag x={1420} y={520} value={14} label="ПАУЗА" f={f} s={1.3} grey heart={false} />
					<g transform={`translate(${1420 + 190},${510}) rotate(${e})`}>
						{[0, 60, 120].map((a) => <line key={a} x1={0} y1={-34} x2={0} y2={34} stroke="#cfe6ff" strokeWidth={7} strokeLinecap="round" transform={`rotate(${a})`} />)}
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 072: Вован у батареи с градусником и хитрым лицом */
const S72: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('072');
	const hold = grow(e, 6, 10);
	let vp = idle(gf, 3);
	vp = hand(vp, 860, 1.25, 1, 'F', [1010, 640], hold);
	const cam = usePush(camOn(950, 540, 1.35), camOn(970, 530, 1.6));
	return (
		<Stage cam={cam} bg="#e9d8bd" light={{x: 20, y: 8, o: 0.4}}>
			<Layer depth={1.6}>
				<Room f={f} />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<rect x={960} y={560} width={220} height={200} rx={10} fill="#f4f1e6" stroke="#6a6a72" strokeWidth={6} />
					{Array.from({length: 7}).map((_, i) => <rect key={i} x={976 + i * 30} y={574} width={18} height={172} rx={6} fill="#d9d3c4" />)}
					{Array.from({length: 3}).map((_, i) => <path key={i} d={`M${1000 + i * 60},520 q-14,-30 0,-50`} stroke="#e2483a" strokeWidth={5} fill="none" opacity={0.55} />)}
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="vovan" x={860} floor={FL} s={1.25} facing={1} faceTurn={0.5} look={[0.3, 0.7]} expr="normal" mouth="smirk" pose={vp} uid="v72" />
					<g transform="translate(1010,630) rotate(-30)" opacity={hold}>
						<rect x={-6} y={-60} width={12} height={120} rx={6} fill="#f4f8ff" stroke="#10132a" strokeWidth={3} />
						<rect x={-3} y={-54} width={6} height={100} rx={3} fill="#e2483a" />
					</g>
					<Tag x={860} y={tagY(1.25) - 4} value={41} f={f} s={1} heart auto bpm={72} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 073a: сообщение тренеру «Заболел» */
const S73a: React.FC = () => {
	const {f, at} = useShot();
	const e = f - at('073');
	const t = grow(e + 49, 56, 10);
	return (
		<Board tint="#1a2150">
			<rect x={640} y={60} width={640} height={960} rx={64} fill="#0c1022" stroke="#8f98bd" strokeWidth={8} />
			<rect x={668} y={110} width={584} height={860} rx={40} fill="#e9ecf6" />
			<rect x={668} y={110} width={584} height={90} rx={40} fill="#2f6fd8" />
			<text x={960} y={170} textAnchor="middle" fontSize={40} fontFamily={FONT} fontWeight={800} fill="#fff">
				ТРЕНЕР
			</text>
			<g transform={`translate(0,${(1 - t) * 40})`} opacity={t}>
				<rect x={900} y={300} width={316} height={110} rx={32} fill="#5fe08a" />
				<text x={1058} y={372} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#10132a">
					Заболел
				</text>
			</g>
		</Board>
	);
};

/* 073b + 074: Вован в кинозале с попкорном; в полночь его «41» трескается и осыпается в «0», ведро падает */
const S74: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('074');
	const crack = grow(e, 38, 4);
	const crumble = grow(e, 44, 36);
	const vx = 900;
	const seat = 800;
	const fall = crumble;
	let vp: Pose = {...FS, lean: -6, legB: [80, 80], legF: [84, 84]};
	vp = hand(vp, vx, 1.25, 1, 'F', [vx + 90, seat - 150 * 0.4 - 20 + fall * 120], 1);
	const cam = usePush(camOn(930, 520, 1.3), camOn(920, 500, 1.55));
	const v = crumble > 0.5 ? 0 : 41;
	return (
		<Stage cam={cam} bg="#12102a" light={{x: 50, y: 5, o: 0.25}}>
			<Layer depth={1.6}>
				<Cinema f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="vovan" x={vx} floor={FL} seat={seat} s={1.25} facing={1} faceTurn={0.5} look={[0.2, -0.5]} expr={crack > 0.5 ? 'wide' : 'normal'} mouth={crack > 0.5 ? 'open' : 'smile'} pose={vp} uid="v74" />
					<g transform={`translate(${vx + 110 + fall * 40},${seat - 80 + fall * 150}) rotate(${fall * 70})`}>
						<polygon points="-34,-40 34,-40 26,50 -26,50" fill="#e2483a" stroke="#10132a" strokeWidth={4} />
						{[-18, 0, 18].map((x) => <line key={x} x1={x} y1={-40} x2={x * 0.8} y2={50} stroke="#fff" strokeWidth={8} />)}
						{[-24, -8, 10, 26].map((x, i) => <circle key={i} cx={x} cy={-50 - (i % 2) * 10} r={13} fill="#fff1b8" stroke="#e0c15a" strokeWidth={2} />)}
					</g>
					{Array.from({length: 9}).map((_, i) => <circle key={i} cx={vx + 110 + (i - 4) * 22 * fall} cy={seat - 90 + fall * (120 + i * 18) - Math.sin(i) * 20} r={11} fill="#fff1b8" opacity={fall > 0.02 ? 1 : 0} />)}
					<g transform={`translate(${Math.sin(e * 3) * 5 * crack * (1 - crumble)},0)`}>
						<Tag x={vx} y={tagY(1.25) + 30} value={v} f={f} s={1.15} heart={false} warn={crack > 0.5} />
						{crack > 0.5 && crumble < 0.5 ? (
							<g stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round">
								<path d={`M${vx - 60},${tagY(1.25) + 0} l24,30 l-18,24 l30,34`} />
							</g>
						) : null}
						{crumble > 0.02 ? ['4', '1'].map((d, i) => <text key={i} x={vx - 28 + i * 40} y={tagY(1.25) + 50 + crumble * (160 + i * 60)} fontSize={50} fontFamily={FONT} fontWeight={900} fill="#fff" opacity={1 - crumble} transform={`rotate(${crumble * (i ? 50 : -50)} ${vx - 28 + i * 40} ${tagY(1.25) + 50})`}>{d}</text>) : null}
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 075: чат зала: фото таблички «0» и ответы */
const S75: React.FC = () => {
	const {f, at} = useShot();
	const e = f - at('075');
	const msg = (y: number, who: string, text: string, k: number, own = false) => (
		<g transform={`translate(0,${(1 - k) * 30})`} opacity={k}>
			<rect x={own ? 880 : 700} y={y} width={own ? 340 : 440} height={84} rx={26} fill={own ? '#5fe08a' : '#fff'} />
			<text x={own ? 900 : 724} y={y + 30} fontSize={22} fontFamily={FONT} fontWeight={800} fill="#2f6fd8">
				{who}
			</text>
			<text x={own ? 900 : 724} y={y + 68} fontSize={34} fontFamily={FONT} fontWeight={700} fill="#10132a">
				{text}
			</text>
		</g>
	);
	return (
		<Board tint="#1a2150">
			<rect x={600} y={50} width={720} height={980} rx={64} fill="#0c1022" stroke="#8f98bd" strokeWidth={8} />
			<rect x={628} y={100} width={664} height={880} rx={40} fill="#dfe4f3" />
			<rect x={628} y={100} width={664} height={86} rx={40} fill="#2f6fd8" />
			<text x={960} y={158} textAnchor="middle" fontSize={38} fontFamily={FONT} fontWeight={800} fill="#fff">
				ЗАЛ · ОБЩИЙ ЧАТ
			</text>
			<g opacity={grow(e, 2, 8)}>
				<rect x={700} y={220} width={440} height={260} rx={26} fill="#fff" />
				<rect x={724} y={244} width={392} height={212} rx={16} fill="#11142c" />
				<text x={920} y={380} textAnchor="middle" fontSize={120} fontFamily={FONT} fontWeight={900} fill="#ff6a5a">
					0
				</text>
				<text x={920} y={330} textAnchor="middle" fontSize={30} fontFamily={FONT} fontWeight={700} fill="#c8d0ea">
					ВОВАН · ДЕНЬ
				</text>
			</g>
			{msg(520, 'Дима', 'ого', grow(e, 20, 8), false)}
			{msg(620, 'Катя', 'ну Вован…', grow(e, 36, 8), false)}
			{msg(720, 'Дед', 'кино хоть хорошее?', grow(e, 52, 8), false)}
		</Board>
	);
};

/* 076: «ПРАВИЛО 3: БОЛЕЗНЬ — ПАУЗА. ВРАНЬЁ — НОЛЬ» */
const S76: React.FC = () => {
	const {f, at} = useShot();
	const e = f - at('076');
	return (
		<Board tint="#1d3a33">
			<Chalk x={960} y={200} text="ПРАВИЛО 3:" k={grow(e, 6, 26)} size={110} anchor="middle" />
			<Chalk x={960} y={420} text="БОЛЕЗНЬ — ПАУЗА" k={grow(e, 40, 34)} size={130} anchor="middle" c="#9fd3ff" />
			<Chalk x={960} y={620} text="ВРАНЬЁ — НОЛЬ" k={grow(e, 90, 30)} size={130} anchor="middle" c="#ff8a7a" />
			<g opacity={grow(e, 60, 12)} transform="translate(960,820)">
				<text textAnchor="middle" fontSize={70} fontFamily={FONT} fontWeight={800} fill="#9fd3ff">
					❄ 14
				</text>
			</g>
			<g opacity={grow(e, 112, 12)} transform="translate(960,930)">
				<text textAnchor="middle" fontSize={70} fontFamily={FONT} fontWeight={800} fill="#ff8a7a">
					41 → 0
				</text>
			</g>
		</Board>
	);
};

export const PART45: ShotDef[] = [
	{at: '060', C: S60, whip: true},
	{at: '061', C: S61, own: true, ownCuts: []},
	{at: '062', C: S62},
	{at: '063', C: S63},
	{at: '064', C: S64, whip: true},
	{at: '065', C: S65, whip: true},
	{at: '066', C: S66, whip: true},
	{at: '069', C: S69, whip: true},
	{at: '070', C: S70, own: true, ownCuts: []},
	{at: '071', C: S71, whip: true},
	{at: '072', C: S72, whip: true},
	{at: '073', C: S73a, own: true, ownCuts: []},
	{at: '073', off: 45, C: S74, whip: true},
	{at: '075', C: S75, own: true, ownCuts: []},
	{at: '076', C: S76, own: true, ownCuts: []},
];
