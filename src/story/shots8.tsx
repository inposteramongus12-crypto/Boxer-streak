import React from 'react';
import {interpolate} from 'remotion';
import {Pose, toLocal} from '../engine/Stickman';
import {blend, env, gesture, idle, reach, walk, walkTo} from '../kit/actions';
import {Actor, counterAt, useShot, useSpeaking} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Layer, Stage, Svg, camOn, clamp, ease, usePush} from '../kit/kit';
import {Bedroom, Blanket, Kitchen} from '../kit/sets';
import {Sleeper} from '../kit/kit';
import {Board, FONT} from '../kit/ui';
import {Onoma} from '../reference/PauseTime';
import {BoxStreet, Clock, Facade, Gym, Tag} from './places';
import {FL, HS, HT, grow, guard, hands, hip, hit, tagY} from './common';
import {Chalk, FS, hand, pill, shadow} from './shots2';
import {Led} from './shots5';

/* Части 10 и 11 (148–175). Табличка героя: «41» → в полночь «0» → «ПРИВЫЧКА 40/66». У Вована «29». */
const SIT: Pose = {lean: -4, head: 0, armB: [25, 70], armF: [35, 65], legB: [88, 85], legF: [92, 90]};
const BLUE = '#7fe0ff';
// табличка-привычка: «ПРИВЫЧКА 40/66» + полоса заполнения cur из cap
export const HabitTag: React.FC<{x: number; y: number; s?: number; cur?: number; cap: number; fill?: number; label?: string; value?: string}> = ({x, y, s = 1, cur = 0, cap, fill, label = 'ПРИВЫЧКА', value}) => {
	const fr = fill ?? cur / cap;
	const v = value ?? `${cur}/${cap}`;
	return (
		<g transform={`translate(${x},${y}) scale(${s})`}>
			<rect x={-210} y={-52} width={420} height={104} rx={52} fill="#11142c" stroke={BLUE} strokeWidth={5} />
			<text x={-180} y={-8} fontSize={24} fontFamily={FONT} fontWeight={800} fill="#bfeaff" letterSpacing={1.5}>{label}</text>
			<text x={176} y={-8} textAnchor="end" fontSize={44} fontFamily={FONT} fontWeight={800} fill="#fff">{v}</text>
			<rect x={-180} y={14} width={360} height={20} rx={10} fill="#2a3363" />
			<rect x={-180} y={14} width={Math.max(0, 360 * fr)} height={20} rx={10} fill={BLUE} />
			<path d="M-14,52 L0,70 L14,52 Z" fill={BLUE} />
		</g>
	);
};
const dim = (k: number) => <div style={{position: 'absolute', inset: 0, background: '#02030a', opacity: k}} />;

/* 148: «День сорок первый» — девять вечера, садится на кровать и засыпает сидя, свет гаснет сам */
const S148: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('148');
	const slump = grow(e, 70, 40);
	const p: Pose = {...SIT, lean: -4 + 14 * slump, head: 22 * slump};
	const off = grow(e, 130, 6);
	const cam = usePush(camOn(1300, 560, 1.15), camOn(1330, 580, 1.4));
	return (
		<Stage cam={cam} bg="#1d2550" light={{x: 45, y: 20, o: 0.3, night: true}}>
			<Layer depth={1.4}>
				<Bedroom f={gf} night />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Blanket f={gf} night />
					<Actor who="hero" x={1290} floor={FL} seat={690} s={HS} facing={-1} faceTurn={0.3} look={[-0.4, 0.5]} expr={slump > 0.5 ? 'sleepy' : 'normal'} lidL={slump} lidR={slump} pose={p} uid="h148" />
					<HT x={1300} s={1.3} yy={690 - 164 * HS - 120} bpm={74} />
					<Onoma x={1160} y={380} text="Zzz" t={(e - 90) % 40} c="#c8d0ea" rot={-8} size={64} />
					<Onoma x={1480} y={560} text="ЩЁЛК" t={e - 130} c="#ffd34a" rot={-6} size={56} />
				</Svg>
			</Layer>
			<Led text="21:00" />
			{dim(off * 0.5)}
		</Stage>
	);
};

/* 149: полночь — мигающая «41» трескается и осыпается в «0» */
const S149: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('149');
	const crack = grow(e, 40, 4);
	const crumble = grow(e, 46, 36);
	const v = crumble > 0.5 ? 0 : 41;
	const cam = usePush(camOn(1300, 520, 1.3), camOn(1320, 500, 1.7));
	return (
		<Stage cam={cam} bg="#0b1030" light={{x: 45, y: 20, o: 0.25, night: true}}>
			<Layer depth={1.4}>
				<Bedroom f={gf} night />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<Clock x={900} y={300} text="00:00" s={1.4} f={f} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Blanket f={gf} night />
					<Actor who="hero" x={1290} floor={FL} seat={690} s={HS} facing={-1} faceTurn={0.3} look={[-0.4, 0.6]} expr="sleepy" lidL={1} lidR={1} pose={{...SIT, lean: 10, head: 22}} uid="h149" />
					<g transform={`translate(${Math.sin(e * 3) * 5 * crack * (1 - crumble)},0)`}>
						<Tag x={1300} y={420} value={v} f={f} s={1.7} warn={crack < 0.5 || v === 41} heart={false} />
						{crack > 0.5 && crumble < 0.5 ? <path d="M1220,370 l30,44 l-24,28 l40,44" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" /> : null}
						{crumble > 0.02 ? ['4', '1'].map((d, i) => <text key={i} x={1292 + i * 56} y={450 + crumble * (260 + i * 60)} fontSize={80} fontFamily={FONT} fontWeight={900} fill="#fff" opacity={1 - crumble} transform={`rotate(${crumble * (i ? 60 : -60)} ${1292 + i * 56} 450)`}>{d}</text>) : null}
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 150: утром фото нуля уже в чате; герой в кровати смотрит в потолок */
const S150: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('150');
	const msg = (x: number, y: number, t: string, k: number) => (
		<g transform={`translate(${x},${y - (1 - k) * 30})`} opacity={k}>
			<rect x={-210} y={-56} width={420} height={112} rx={34} fill="#fff" stroke="#10132a" strokeWidth={4} />
			<text x={0} y={20} textAnchor="middle" fontSize={62} fontFamily={FONT} fontWeight={900} fill="#10132a">{t}</text>
		</g>
	);
	const cam = usePush(camOn(1100, 520, 1.1), camOn(1250, 560, 1.3));
	return (
		<Stage cam={cam} bg="#a9cfe0" light={{x: 45, y: 20, o: 0.5}}>
			<Layer depth={1.4}>
				<Bedroom f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Sleeper x={1500} y={700} s={1} expr="sleepy" />
					<Blanket f={gf} />
					<Tag x={1400} y={540} value={counterAt(gf)} f={f} s={1.6} heart={false} />
					<g transform="translate(900,330)">
						<rect x={-110} y={-120} width={220} height={240} rx={26} fill="#0c1022" stroke="#8f98bd" strokeWidth={6} />
						<rect x={-92} y={-96} width={184} height={170} rx={14} fill="#11142c" />
						<text x={0} y={34} textAnchor="middle" fontSize={110} fontFamily={FONT} fontWeight={900} fill="#ff6a5a">0</text>
					</g>
					{msg(780, 240, 'ого', grow(e, 30, 8))}
					{msg(840, 380, 'Саня?!', grow(e, 60, 8))}
				</Svg>
			</Layer>
			<Led text="08:10" />
		</Stage>
	);
};

/* 151: открытка сестры «Сане сорок дней!» на холодильнике: фломастер, кривая «40», сердечко */
const S151: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('151');
	const draw = grow(e, 24, 60);
	const cam = usePush(camOn(1500, 560, 1.2), camOn(1635, 600, 2.1));
	return (
		<Stage cam={cam} bg="#f3e6c4" light={{x: 20, y: 8, o: 0.4}}>
			<Layer depth={1.6}>
				<Kitchen />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<g transform="translate(1635,610) rotate(-4)">
						<rect x={-130} y={-170} width={260} height={340} rx={8} fill="#fff7d6" stroke="#c9b97a" strokeWidth={4} />
						<text x={0} y={-100} textAnchor="middle" fontSize={50} fontFamily="'Caveat', cursive" fontWeight={700} fill="#d6342a" opacity={draw}>Сане</text>
						<text x={0} y={-40} textAnchor="middle" fontSize={56} fontFamily="'Caveat', cursive" fontWeight={700} fill="#2f6fd8" opacity={grow(e, 40, 20)}>сорок дней!</text>
						<text x={-10} y={70} textAnchor="middle" fontSize={120} fontFamily="'Caveat', cursive" fontWeight={700} fill="#3aa37a" transform="rotate(-8)" opacity={grow(e, 60, 20)}>40</text>
						<path d="M70,110 C40,80 80,60 90,90 C100,60 140,80 110,110 L90,135 Z" fill="#e86aa0" opacity={grow(e, 84, 14)} transform="translate(-20,10) scale(0.8)" />
						<rect x={-20} y={-182} width={40} height={30} rx={6} fill="#e2483a" />
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 152: потолок, на нём мелом «0»; глаза героя над одеялом */
const S152: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('152');
	const z = interpolate(e, [0, 90], [1, 1.06], clamp);
	return (
		<Board tint="#2a3040">
			<g transform={`translate(960,540) scale(${z}) translate(-960,-540)`}>
				<circle cx={960} cy={120} r={60} fill="#fff3c0" opacity={0.6} />
				<Chalk x={960} y={600} text="0" k={grow(e, 6, 30)} size={520} anchor="middle" c="#f4f1e6" />
				<rect x={0} y={880} width={1920} height={200} fill="#3a5fb0" />
				<Actor who="hero" x={960} floor={1180} s={1.4} facing={1} faceTurn={0.1} look={[0, -1]} expr="sleepy" pose={idle(gf, 1)} uid="h152" />
				<rect x={0} y={900} width={1920} height={180} fill="#3a5fb0" />
			</g>
		</Board>
	);
};

/* 153 HERO: «Сорок дней. И всё.» — шёпотом, натягивает одеяло на голову */
const S153: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('153');
	const up = grow(e, 10, 26);
	const cam = usePush(camOn(1450, 640, 1.5), camOn(1470, 630, 1.75));
	return (
		<Stage cam={cam} bg="#a9cfe0" light={{x: 45, y: 20, o: 0.5}}>
			<Layer depth={1.4}>
				<Bedroom f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Sleeper x={1500} y={700} s={1} expr="sad" />
					<Blanket f={gf} lift={-10 * up} />
					<rect x={1200} y={690 - 150 * up} width={380} height={150 * up + 40} rx={30} fill="#f2b21c" stroke="#10132a" strokeWidth={4} opacity={up > 0.05 ? 1 : 0} />
					<Tag x={1380} y={520} value={counterAt(gf)} f={f} s={1.5} heart={false} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 154: ноги сами несут в зал — герой идёт с сумкой и удивлённо смотрит на свои кроссовки */
const S154: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('154');
	const w = walkTo(e, 0, 150, 200, 1500, 1, 0.28);
	const look = grow(e, 60, 10);
	const p: Pose = {...w.pose, head: w.pose.head + 18 * look};
	const camW = camOn(w.x + 160, 560, 1.2);
	const camS = usePush(camOn(w.x + 20, 840, 2.2), camOn(w.x + 60, 840, 2.5));
	const cam = e < 60 ? camW : camS;
	return (
		<Stage cam={cam} bg="#3b4a78" light={{x: 70, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<BoxStreet f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={w.x} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.2, 0.9 * look]} expr={look > 0.5 ? 'wide' : 'sleepy'} pose={p} vx={w.vx} bob={w.bob} uid="h154" />
					<rect x={w.x - 52} y={hip(HS) - 40} width={50} height={80} rx={12} fill="#3a4256" stroke="#10132a" strokeWidth={3} />
					<HT x={w.x + 10} s={1.2} yy={tagY(HS) - w.bob} bpm={80} />
					{look > 0.5 ? <Onoma x={w.x + 100} y={760} text="?!" t={e - 66} c="#ffd34a" rot={-6} size={70} /> : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* зал: скамейка */
const Bench: React.FC<{x: number}> = ({x}) => (
	<g>
		<rect x={x - 200} y={760} width={400} height={26} rx={8} fill="#6e4a2e" stroke="#10132a" strokeWidth={4} />
		<rect x={x - 180} y={786} width={20} height={114} fill="#2a1a10" />
		<rect x={x + 160} y={786} width={20} height={114} fill="#2a1a10" />
	</g>
);

/* 155: в зале — Вован на скамейке; 156: бинтует руки не глядя, «НЕ ДУМАЯ» */
const S155: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('155');
	const e156 = f - at('156');
	const wr = Math.sin(f / 4);
	let vp: Pose = {...SIT, lean: -2};
	vp = reach(reach(vp, 'F', [60 + wr * 8, 20], grow(e156, 8, 10)), 'B', [52 - wr * 8, 24], grow(e156, 8, 10));
	const win = walkTo(e, 0, 70, 120, 520, 1, 0.3);
	const cam = e < 120 ? usePush(camOn(900, 560, 1.1), camOn(1000, 580, 1.3)) : usePush(camOn(1200, 600, 1.5), camOn(1230, 600, 1.75));
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Bench x={1200} />
					<Actor who="vovan" x={1200} floor={FL} seat={760} s={1.25} facing={-1} faceTurn={0.5} look={[-0.1, -0.6]} expr="normal" mouth="flat" pose={vp} uid="v155" />
					{e156 > 0 ? <rect x={1200 - 70 - 8 * wr} y={640} width={50} height={36} rx={10} fill="#f2efe6" stroke="#10132a" strokeWidth={3} /> : null}
					<Tag x={1200} y={760 - 164 * 1.25 - 135} value={29} f={f} s={grow(e156, -6, 10) * 1.3 + 0.001} bpm={62} />
					{e156 > 20 ? pill(1000, 330, 'НЕ ДУМАЯ', '#ffd34a', grow(e156, 20, 10), 56) : null}
					<Actor who="hero" x={win.x} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0]} expr="worried" pose={win.pose} vx={win.vx} bob={win.bob} uid="h155" />
					<HT x={win.x + 10} s={1.2} yy={tagY(HS) - win.bob} bpm={80} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 157 HERO + 158: «Ты же сгорел. Зачем пришёл?» — Вован пожимает плечами и показывает на свои кроссовки */
const S157: React.FC = () => {
	const {f, gf, at} = useShot();
	const sp = useSpeaking(gf);
	const e = f - at('157');
	const sh = env(f, at('158') + 2, at('158') + 36, 6, 8);
	const pt = env(f, at('158') + 40, at('158') + 100, 6, 8);
	const lk = grow(f, at('158') + 70, 12);
	let vp: Pose = gesture('shrug', {...SIT, lean: -2}, sh, f);
	vp = reach(vp, 'F', [50, 100], pt);
	const hp: Pose = {...SIT, head: 14 * lk};
	const cam = sp === 'HERO' ? camOn(980, 600, 1.7) : pt > 0.3 ? usePush(camOn(1120, 760, 2.0), camOn(1120, 770, 2.3)) : camOn(1080, 590, 1.4);
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Bench x={1060} />
					<Actor who="hero" x={900} floor={FL} seat={760} s={HS} facing={1} faceTurn={0.5} look={[0.6, 0.2 + 0.7 * lk]} expr={lk > 0.5 ? 'worried' : 'normal'} pose={hp} uid="h157" />
					<Actor who="vovan" x={1240} floor={FL} seat={760} s={1.25} facing={-1} faceTurn={0.5} look={[-0.7, 0.2]} expr="normal" mouth="smirk" pose={vp} uid="v157" />
					<HT x={910} s={1.3} yy={760 - 164 * HS - 120} bpm={80} />
					<Tag x={1240} y={760 - 164 * 1.25 - 135} value={29} f={f} s={1.3} bpm={62} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 159: сплит «0 → 29», Вован каждый день в дверях зала */
const S159: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('159');
	const n = Math.round(interpolate(e, [10, 90], [0, 29], {...clamp, easing: ease}));
	const w = walkTo(e % 30, 0, 24, 1250, 1530, 3, 0.3);
	return (
		<Board tint="#13213a">
			<line x1={960} y1={0} x2={960} y2={1080} stroke="#fff" strokeWidth={8} opacity={0.5} />
			<Tag x={480} y={420} value={n} f={f} s={3.4} heart={false} />
			<text x={480} y={760} textAnchor="middle" fontSize={96} fontFamily={FONT} fontWeight={900} fill="#c8d0ea">ВОВАН</text>
			<g>
				<rect x={1280} y={260} width={300} height={640} fill="#1c2438" stroke="#6e4a2e" strokeWidth={10} />
				<rect x={1296} y={276} width={268} height={624} fill="#35466e" />
				<Actor who="vovan" x={1090 + 120 * Math.min(1, (e % 30) / 24)} floor={900} s={1.25} facing={1} faceTurn={0.4} look={[0.8, 0]} expr="normal" mouth="smirk" pose={walkTo(e % 30, 0, 24, 1090, 1210, 3, 0.3).pose} uid="v159" />
				<text x={1430} y={190} textAnchor="middle" fontSize={84} fontFamily={FONT} fontWeight={900} fill="#ffd34a">ДЕНЬ {Math.max(1, n)}</text>
			</g>
		</Board>
	);
};

/* 160 TRAINER + 161 TRAINER: «Учёные ловили момент…» — тренер садится рядом, показывает на табличку героя: шестьдесят шесть */
const S160: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('160');
	const sit = grow(e, 4, 20);
	const point = grow(f, at('161') + 4, 10);
	const tx = interpolate(sit, [0, 1], [1500, 1240]);
	let tp: Pose = blend(idle(gf, 3), SIT, sit);
	tp = gesture('point', tp, point, f);
	const pl = grow(f, at('161') + 60, 10);
	const cam = usePush(camOn(1020, 570, 1.2), camOn(1060, 560, 1.5));
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Bench x={1060} />
					<Actor who="hero" x={900} floor={FL} seat={760} s={HS} facing={1} faceTurn={0.5} look={[0.6, 0.2]} expr="normal" pose={SIT} uid="h160" />
					<HT x={910} s={1.35} yy={760 - 164 * HS - 125} bpm={80} />
					<Actor who="trainer" x={tx} floor={FL} seat={sit > 0.95 ? 760 : undefined} s={1.02} facing={-1} faceTurn={0.5} look={[-0.7, 0]} mouth="open" pose={tp} uid="t160" handF={point > 0.5 ? 'point' : undefined} />
					{pl > 0.02 ? pill(1060, 330, '66', '#7fe0ff', pl, 90) : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* Lally: точки от 18 до 254, отметка 66 */
const seeded = (i: number) => {
	const x = Math.sin(i * 127.1 + 31.7) * 43758.5453;
	return x - Math.floor(x);
};
const Cite: React.FC<{k?: number}> = ({k = 1}) => (
	<text x={1860} y={1030} textAnchor="end" fontSize={40} fontFamily={FONT} fontWeight={700} fill="#c8d0ea" opacity={k}>Lally et al., UCL, 2009</text>
);
const S162: React.FC = () => {
	const {f, at} = useShot();
	const e = f - at('162');
	const X0 = 200;
	const X1 = 1760;
	const px = (d: number) => X0 + (d / 270) * (X1 - X0);
	const dots = Array.from({length: 44}).map((_, i) => {
		// схематично: больше всего вокруг 40–90, хвост до 254; края ровно 18 и 254
		const u = seeded(i);
		const d = i === 0 ? 18 : i === 43 ? 254 : Math.round(18 + (254 - 18) * Math.pow(u, 2.2));
		return {d, y: 560 + (seeded(i + 90) - 0.5) * 230, t: 8 + i * 1.2};
	});
	return (
		<Board tint="#1a2150">
			<text x={960} y={140} textAnchor="middle" fontSize={84} fontFamily={FONT} fontWeight={900} fill="#fff">СКОЛЬКО ДНЕЙ ДО АВТОМАТА</text>
			<line x1={X0} y1={760} x2={X1} y2={760} stroke="#c8d0ea" strokeWidth={6} />
			{[0, 50, 100, 150, 200, 250].map((d) => (
				<g key={d}>
					<line x1={px(d)} y1={760} x2={px(d)} y2={776} stroke="#c8d0ea" strokeWidth={5} />
					<text x={px(d)} y={830} textAnchor="middle" fontSize={52} fontFamily={FONT} fontWeight={700} fill="#c8d0ea">{d}</text>
				</g>
			))}
			{dots.map((d, i) => <circle key={i} cx={px(d.d)} cy={d.y} r={20} fill={d.d === 18 || d.d === 254 ? '#ffd34a' : '#7fe0ff'} stroke="#10132a" strokeWidth={3} opacity={grow(e, d.t, 6)} />)}
			<g opacity={grow(e, 70, 10)}>
				<line x1={px(66)} y1={330} x2={px(66)} y2={760} stroke="#ff6a5a" strokeWidth={8} strokeDasharray="14 10" />
				<text x={px(66)} y={300} textAnchor="middle" fontSize={96} fontFamily={FONT} fontWeight={900} fill="#ff6a5a">66</text>
				<text x={px(66) + 24} y={380} fontSize={40} fontFamily={FONT} fontWeight={800} fill="#ffb0a0">ТИПИЧНЫЙ</text>
			</g>
			<g opacity={grow(e, 110, 10)}>
				<text x={px(18)} y={910} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#ffd34a">18</text>
				<text x={px(254)} y={910} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#ffd34a">254</text>
			</g>
			<text x={200} y={1030} fontSize={40} fontFamily={FONT} fontWeight={600} fill="#b8c0e0">схема: каждая точка — один участник</text>
			<Cite k={1} />
		</Board>
	);
};

/* 163: редкие пропуски — линия растёт; частые — падает */
const S163: React.FC = () => {
	const {f, at} = useShot();
	const e = f - at('163');
	const X0 = 240;
	const X1 = 1700;
	const Y0 = 860;
	const ptsA = [0, 0.12, 0.26, 0.4, 0.5, 0.47, 0.6, 0.72, 0.82, 0.9];
	const ptsB = [0, 0.1, 0.2, 0.12, 0.26, 0.16, 0.18, 0.1, 0.14, 0.06];
	const line = (arr: number[], k: number) => arr.map((v, i) => (i / (arr.length - 1) <= k ? `${i ? 'L' : 'M'}${X0 + (i / (arr.length - 1)) * (X1 - X0)},${Y0 - v * 560}` : '')).join(' ');
	const ka = grow(e, 10, 60);
	const kb = grow(e, 40, 70);
	return (
		<Board tint="#1a2150">
			<text x={960} y={130} textAnchor="middle" fontSize={76} fontFamily={FONT} fontWeight={900} fill="#fff">АВТОМАТИЗМ ПО ДНЯМ</text>
			<line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke="#c8d0ea" strokeWidth={6} />
			<line x1={X0} y1={Y0} x2={X0} y2={260} stroke="#c8d0ea" strokeWidth={6} />
			<path d={line(ptsA, ka)} stroke="#5fe08a" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			<path d={line(ptsB, kb)} stroke="#ff6a5a" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			<g opacity={grow(e, 50, 10)}>
				<circle cx={X0 + (5 / 9) * (X1 - X0)} cy={Y0 - 0.47 * 560} r={22} fill="#fff" stroke="#10132a" strokeWidth={5} />
				<text x={X0 + (5 / 9) * (X1 - X0)} y={Y0 - 0.47 * 560 - 40} textAnchor="middle" fontSize={50} fontFamily={FONT} fontWeight={900} fill="#fff">ОДИН ПРОПУСК</text>
			</g>
			<text x={X1} y={Y0 - 0.9 * 560 - 30} textAnchor="end" fontSize={60} fontFamily={FONT} fontWeight={900} fill="#5fe08a">РЕДКИЕ ПРОПУСКИ</text>
			<text x={X1} y={Y0 + 110} textAnchor="end" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#ff6a5a">ЧАСТЫЕ ПРОПУСКИ</text>
			<text x={200} y={1030} fontSize={40} fontFamily={FONT} fontWeight={600} fill="#b8c0e0">схема: линии показывают идею, не измерения</text>
			<Cite k={1} />
		</Board>
	);
};

/* 164: выноска «ПРИВЫЧКА ≠ НАВЫК» */
const S164: React.FC = () => {
	const {f, at} = useShot();
	const e = f - at('164');
	return (
		<Board tint="#241638">
			<text x={960} y={300} textAnchor="middle" fontSize={190} fontFamily={FONT} fontWeight={900} fill="#7fe0ff" opacity={grow(e, 6, 16)}>ПРИВЫЧКА</text>
			<text x={960} y={500} textAnchor="middle" fontSize={200} fontFamily={FONT} fontWeight={900} fill="#ff6a5a" transform={`scale(${0.6 + 0.4 * grow(e, 40, 10)})`} style={{transformOrigin: '960px 440px'}} opacity={grow(e, 40, 10)}>≠</text>
			<text x={960} y={720} textAnchor="middle" fontSize={190} fontFamily={FONT} fontWeight={900} fill="#ffd34a" opacity={grow(e, 60, 16)}>НАВЫК</text>
			<text x={480} y={900} textAnchor="middle" fontSize={56} fontFamily={FONT} fontWeight={800} fill="#bfeaff" opacity={grow(e, 90, 12)}>ПРИХОДИТЬ</text>
			<text x={1440} y={900} textAnchor="middle" fontSize={56} fontFamily={FONT} fontWeight={800} fill="#ffe08a" opacity={grow(e, 110, 12)}>КАК ТЫ БЬЁШЬ</text>
		</Board>
	);
};

/* 165: табличка мигает и морфится в «ПРИВЫЧКА 40/66» */
const S165: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('165');
	const morph = grow(e, 64, 20);
	const cam = usePush(camOn(960, 520, 1.4), camOn(970, 480, 1.9));
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={960} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.3, -0.4]} expr="normal" pose={idle(gf, 1)} uid="h165" />
					{morph < 0.5 ? <g opacity={1 - morph * 2}><Tag x={960} y={tagY(HS) - 40} value={0} f={f} s={1.5} warn heart={false} /></g> : null}
					{morph > 0.02 ? <g opacity={Math.min(1, morph * 1.6)}><HabitTag x={960} y={tagY(HS) - 50} s={1.4 * (0.8 + 0.2 * morph)} cur={40} cap={66} fill={40 / 66 * grow(e, 84, 30)} /></g> : null}
					{morph > 0.02 && morph < 0.9 ? Array.from({length: 12}).map((_, i) => <circle key={i} cx={960 + Math.cos(i) * 320 * morph} cy={tagY(HS) - 50 + Math.sin(i * 1.7) * 140 * morph} r={9 * (1 - morph)} fill="#bfeaff" />) : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 166: герой смотрит вверх и впервые улыбается за серию */
const S166: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('166');
	const sm = grow(e, 40, 14);
	const cam = usePush(camOn(960, 560, 1.7), camOn(960, 540, 2.1));
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={960} floor={FL} s={HS} facing={1} faceTurn={0.2} look={[0, -0.9]} expr="normal" mouth={sm > 0.5 ? 'smile' : 'flat'} pose={idle(gf, 1)} uid="h166" />
					<HabitTag x={960} y={tagY(HS) - 70} s={1.4} cur={40} cap={66} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* ================= ЧАСТЬ 11 ================= */

/* 167: две полосы — у героя почти полная (из 66), у Тёмы на треть (из 254) */
const S167: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('167');
	const z = interpolate(e, [0, 172], [1, 1.05], clamp);
	return (
		<Board tint="#13301f">
			<g transform={`translate(960,540) scale(${z}) translate(-960,-540)`}>
				<text x={960} y={140} textAnchor="middle" fontSize={110} fontFamily={FONT} fontWeight={900} fill="#fff">ДЕНЬ 66</text>
				<HabitTag x={500} y={330} s={1.9} cur={64} cap={66} />
				<text x={500} y={470} textAnchor="middle" fontSize={76} fontFamily={FONT} fontWeight={900} fill="#ffd34a">САНЯ</text>
				<HabitTag x={1420} y={330} s={1.9} cur={84} cap={254} />
				<text x={1420} y={470} textAnchor="middle" fontSize={76} fontFamily={FONT} fontWeight={900} fill="#ff8a7a">ТЁМА</text>
				<Actor who="hero" x={500} floor={1070} s={1.5} facing={1} faceTurn={0.4} look={[0.5, -0.2]} expr="normal" mouth="smile" pose={idle(gf, 1)} uid="h167" />
				<Actor who="tema" x={1420} floor={1070} s={1.5} facing={-1} faceTurn={0.4} look={[-0.5, -0.2]} expr="normal" mouth="smile" pose={idle(gf, 4)} uid="t167" />
			</g>
		</Board>
	);
};

/* 168 TEMA + 169 HERO: «Мне, похоже, все двести пятьдесят четыре.» — «Значит, хожу с тобой все двести пятьдесят четыре.» */
const S168: React.FC = () => {
	const {f, gf, at} = useShot();
	const sp = useSpeaking(gf);
	const wrapK = Math.sin(f / 4);
	let tp: Pose = idle(gf, 4);
	tp = reach(reach(tp, 'F', [40 + wrapK * 6, -80], 1), 'B', [34 - wrapK * 6, -84], 1);
	const pat = env(f, at('169') + 30, at('169') + 70, 6, 8);
	let hp: Pose = idle(gf, 1);
	hp = reach(hp, 'F', toLocal(760, hip(1) - 140, 640, hip(HS), HS, 1), pat);
	const laugh = Math.abs(Math.sin(f / 3)) * (f < at('169') ? 1 : 0.3);
	const cam = sp === 'HERO' ? camOn(620, 540, 1.6) : sp === 'TEMA' ? camOn(840, 540, 1.6) : camOn(740, 560, 1.3);
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={640} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.8, 0]} expr="normal" mouth="smile" pose={hp} uid="h168" />
					<HabitTag x={640} y={tagY(HS) - 150} s={1.2} cur={64} cap={66} />
					<Actor who="tema" x={840} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.7, 0.4]} expr="normal" mouth="smile" squash={0.02 * laugh} pose={tp} uid="t168" />
					<HabitTag x={900} y={tagY(1) - 30} s={1.2} cur={84} cap={254} />
					<rect x={840 - 70} y={hip(1) - 90} width={44} height={30} rx={10} fill="#f2efe6" stroke="#10132a" strokeWidth={3} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 170 + 171: тренер поправляет локоть Тёме, потом герою; «Локоть!» — стучит лапой */
const S170: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('170');
	const toH = grow(e, 56, 12);
	const tx = interpolate(toH, [0, 1], [880, 1040]);
	let tr: Pose = reach(idle(gf, 3), 'F', toLocal(tx - 110, 640, tx, hip(1.02), 1.02, -1), grow(e, 20, 8) * (1 - toH) + env(f, at('171'), at('171') + 16, 3, 6));
	const cam = usePush(camOn(900, 560, 1.25), camOn(960, 560, 1.5));
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="tema" x={560} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.8, 0]} expr="normal" pose={guard(idle(gf, 4), 1)} uid="t170" />
					<Actor who="hero" x={1200} floor={FL} s={HS} facing={-1} faceTurn={0.4} look={[-0.8, 0]} expr="normal" pose={guard(idle(gf, 1), 1)} uid="h170" />
					<Actor who="trainer" x={tx} floor={FL} s={1.02} facing={toH > 0.5 ? -1 : 1} faceTurn={0.5} look={[toH > 0.5 ? -0.8 : 0.8, 0.3]} mouth={f > at('171') ? 'open' : undefined} pose={tr} uid="t170b" />
					<Onoma x={1100} y={600} text="ТУК" t={f - (at('171') + 6)} c="#fff" rot={-6} size={52} />
					{pill(880, 330, 'ЛОКОТЬ', '#ffd34a', grow(e, 60, 10), 56)}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 172: двор под окном, фонарь, три тени: герой, Тёма и брат в огромных перчатках */
const S172: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('172');
	const punch = (i: number, s: number) => Math.abs(Math.sin((e + i * 7) / 5)) * s;
	const mk = (seed: number, x: number, sc: number, face: 1 | -1) => {
		let p = guard(idle(gf, seed), 1);
		p = hit(p, 'F', x, sc, face, [x + face * 130 * sc, hip(sc) - 90], Math.max(0, Math.sin((e + seed * 9) / 6)));
		return p;
	};
	const glove = (x: number, y: number, r: number) => <circle cx={x} cy={y} r={r} fill="#d6342a" stroke="#10132a" strokeWidth={4} />;
	const sh = (x: number, sc: number, c: number) => (
		<g opacity={0.35} transform={`translate(${x},${FL})`}>
			<ellipse cx={0} cy={-157 * sc * 2.1} rx={64 * sc * 1.9} ry={86 * sc * 1.9} fill="#05060f" />
			<rect x={-70 * sc * 1.6} y={-157 * sc * 1.9} width={140 * sc * 1.6} height={157 * sc * 1.9} rx={50} fill="#05060f" />
		</g>
	);
	const cam = usePush(camOn(1000, 520, 1.1), camOn(1020, 540, 1.35));
	return (
		<Stage cam={cam} bg="#2f3a6a" light={{x: 70, y: 8, o: 0.3, night: true}}>
			<Layer depth={1.6}>
				<Facade f={f} />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<polygon points="1020,120 1100,120 1500,900 640,900" fill="#ffe9a8" opacity={0.25} />
					<ellipse cx={1060} cy={116} rx={54} ry={12} fill="#fff3b0" />
					{sh(700, 1.05, 0)}
					{sh(1060, 1, 0)}
					{sh(1330, 0.6, 0)}
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={700} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0]} expr="normal" mouth="smile" pose={mk(1, 700, HS, 1)} uid="h172" />
					<HabitTag x={700} y={tagY(HS) - 150} s={1.0} cur={64} cap={66} />
					<Actor who="tema" x={1060} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0]} expr="normal" mouth="smile" pose={mk(4, 1060, 1, -1)} uid="t172" />
					<HabitTag x={1060} y={tagY(1) - 40} s={1.0} cur={84} cap={254} />
					<Actor who="bro" x={1330} floor={FL} s={0.6} facing={-1} faceTurn={0.4} look={[-0.8, 0]} expr="normal" mouth="smile" pose={mk(7, 1330, 0.6, -1)} uid="b172" />
					{glove(1330 - 90, hip(0.6) - 60 + punch(0, 14), 32)}
					{glove(1330 - 70, hip(0.6) - 30 - punch(1, 14), 32)}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 173: щелчок — над самой маленькой загорается «ДЕНЬ 1», искры, брат подпрыгивает */
const S173: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('173');
	const on = grow(e, 20, 6);
	const jump = Math.abs(Math.sin(Math.min(e - 22, 22) / 7)) * (e > 22 ? 40 : 0);
	const ring = Math.max(0, 1 - (e - 20) / 22);
	const cam = usePush(camOn(1250, 650, 1.45), camOn(1250, 630, 1.75));
	return (
		<Stage cam={cam} bg="#2f3a6a" light={{x: 70, y: 8, o: 0.3, night: true}}>
			<Layer depth={1.6}>
				<Facade f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="bro" x={1250} floor={FL} s={0.6} facing={-1} faceTurn={0.4} look={[-0.6, -0.5]} expr={on > 0.5 ? 'wide' : 'normal'} mouth={on > 0.5 ? 'open' : 'smile'} pose={guard(idle(gf, 7), 1)} bob={jump} uid="b173" />
					<circle cx={1160} cy={hip(0.6) - 60 - jump * 0.6} r={34} fill="#d6342a" stroke="#10132a" strokeWidth={4} />
					<circle cx={1180} cy={hip(0.6) - 30 - jump * 0.6} r={34} fill="#d6342a" stroke="#10132a" strokeWidth={4} />
					{on > 0.02 ? <Tag x={1250} y={hip(0.6) - 164 * 0.6 - 130 - jump} value={1} f={f} s={1.5 * on} heart={false} pop={1 + 0.3 * Math.exp(-Math.max(0, e - 22) / 5)} /> : null}
					{e > 20 && e < 42 ? <circle cx={1250} cy={hip(0.6) - 164 * 0.6 - 130 - jump} r={60 + (e - 20) * 8} fill="none" stroke="#ffe08a" strokeWidth={8 * ring} opacity={ring} /> : null}
					{e > 20 && e < 46 ? Array.from({length: 12}).map((_, i) => <circle key={i} cx={1250 + Math.cos(i * 0.52) * (e - 20) * 7} cy={hip(0.6) - 164 * 0.6 - 130 + Math.sin(i * 0.52) * (e - 20) * 5} r={6} fill="#ffe08a" />) : null}
					<Onoma x={1010} y={hip(0.6) - 330} text="ЩЁЛК" t={e - 20} c="#ffd34a" rot={-8} size={56} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 174: финальный вопрос — крупно, выше от низа кадра */
const S174: React.FC = () => {
	const {f, at} = useShot();
	const e = f - at('174');
	const z = interpolate(e, [0, 112], [1, 1.04], clamp);
	return (
		<Board tint="#101626">
			<g transform={`translate(960,400) scale(${z}) translate(-960,-400)`}>
				<text x={960} y={250} textAnchor="middle" fontSize={140} fontFamily={FONT} fontWeight={900} fill="#fff" opacity={grow(e, 6, 14)}>А ЧТО ТЫ БРОСИЛ</text>
				<text x={960} y={410} textAnchor="middle" fontSize={140} fontFamily={FONT} fontWeight={900} fill="#ffc94a" opacity={grow(e, 30, 14)}>ПОСЛЕ ПЕРВОГО</text>
				<text x={960} y={570} textAnchor="middle" fontSize={140} fontFamily={FONT} fontWeight={900} fill="#ffc94a" opacity={grow(e, 50, 14)}>ПРОПУСКА?</text>
			</g>
		</Board>
	);
};

/* 175: календарь — «ТУРНИР» и рядом «СМЕНА», затемнение */
const S175: React.FC = () => {
	const {f, at} = useShot();
	const e = f - at('175');
	const fade = grow(e, 96, 40);
	const days = Array.from({length: 35});
	return (
		<Board tint="#13213a">
			<text x={960} y={140} textAnchor="middle" fontSize={84} fontFamily={FONT} fontWeight={900} fill="#c8d0ea">ЧЕРЕЗ МЕСЯЦ</text>
			<g transform="translate(120,190) scale(1.22)">
				{days.map((_, i) => {
					const c = i % 7;
					const r = Math.floor(i / 7);
					const hot = i === 17;
					return (
						<g key={i}>
							<rect x={c * 200} y={r * 120} width={190} height={110} rx={14} fill={hot ? '#2a3363' : '#1b2350'} stroke={hot ? '#ffd34a' : '#2f3a6a'} strokeWidth={hot ? 6 : 3} />
							<text x={c * 200 + 18} y={r * 120 + 42} fontSize={38} fontFamily={FONT} fontWeight={700} fill="#8f98bd">{i + 1}</text>
						</g>
					);
				})}
				<g opacity={grow(e, 30, 12)}>
					<rect x={3 * 200 + 6} y={2 * 120 + 50} width={178} height={52} rx={12} fill="#e2483a" />
					<text x={3 * 200 + 95} y={2 * 120 + 92} textAnchor="middle" fontSize={40} fontFamily={FONT} fontWeight={900} fill="#fff">ТУРНИР</text>
				</g>
				<g opacity={grow(e, 62, 12)}>
					<rect x={4 * 200 + 6} y={2 * 120 + 50} width={178} height={52} rx={12} fill="#2f6fd8" />
					<text x={4 * 200 + 95} y={2 * 120 + 92} textAnchor="middle" fontSize={40} fontFamily={FONT} fontWeight={900} fill="#fff">СМЕНА</text>
				</g>
			</g>
			{dim(0)}
			<rect x={0} y={0} width={1920} height={1080} fill="#02030a" opacity={fade} />
		</Board>
	);
};

export const PART1011: ShotDef[] = [
	{at: '148', C: S148, whip: true},
	{at: '149', C: S149},
	{at: '150', C: S150, whip: true},
	{at: '151', C: S151, whip: true},
	{at: '152', C: S152, own: true, ownCuts: []},
	{at: '153', C: S153, whip: true},
	{at: '154', C: S154, whip: true},
	{at: '155', C: S155, whip: true},
	{at: '157', C: S157},
	{at: '159', C: S159, own: true, ownCuts: []},
	{at: '160', C: S160, whip: true},
	{at: '162', C: S162, own: true, ownCuts: []},
	{at: '163', C: S163, own: true, ownCuts: []},
	{at: '164', C: S164, own: true, ownCuts: []},
	{at: '165', C: S165, whip: true},
	{at: '166', C: S166},
	{at: '167', C: S167, own: true, ownCuts: []},
	{at: '168', C: S168, whip: true},
	{at: '170', C: S170},
	{at: '172', C: S172, whip: true},
	{at: '173', C: S173},
	{at: '174', C: S174, own: true, ownCuts: []},
	{at: '175', C: S175, own: true, ownCuts: []},
];
