import React from 'react';
import {interpolate} from 'remotion';
import {Pose, toLocal} from '../engine/Stickman';
import {blend, env, gesture, idle, reach, walk, walkTo} from '../kit/actions';
import {Actor, counterAt, useShot, useSpeaking} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Layer, Stage, Svg, camOn, clamp, ease, usePush} from '../kit/kit';
import {Bubble, Board, FONT} from '../kit/ui';
import {Kitchen} from '../kit/sets';
import {Onoma} from '../reference/PauseTime';
import {Clock, Facade, NightRoad, Room, Tag} from './places';
import {FL, HS, HT, grow, guard, hands, hip, hit, tagY} from './common';
import {Chalk, FS, hand, pill, shadow} from './shots2';
import {Led} from './shots5';
import {Knot} from './shots4';

/* Часть 8 (109–126). Табличка героя «29» мигает вечером (не засчитан); у Тёмы на звонке 23:03 — «28» мигает,
   после «Я выбываю» — «29» мигает красным. Время: 23:02 звонок, 23:05 два пути, 23:23 половина пути, 23:30 вопрос. */
const wrapOn = (p: Pose, x: number, s: number) => {
	const h = hands(p, x, s, 1);
	return [h.f, h.b].map((q, i) => <rect key={i} x={q[0] - 18} y={q[1] - 14} width={40} height={30} rx={10} fill="#f2efe6" stroke="#10132a" strokeWidth={3} />);
};

/* 109: сплит — герой в бинтах / тёмная кухня Тёмы; 23:02 */
const S109: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('109');
	let hp = idle(gf, 1);
	hp = reach(hp, 'F', [-14, -150], 1);
	let tp = idle(gf, 4);
	tp = reach(tp, 'F', [-14, -150], 1);
	const k = 1 + 0.02 * Math.sin(e / 20);
	return (
		<Board tint="#13213a">
			<rect x={0} y={0} width={960} height={1080} fill="#262b48" />
			<rect x={0} y={900} width={960} height={180} fill="#5a4636" />
			<rect x={960} y={0} width={960} height={1080} fill="#1b1d34" />
			<rect x={960} y={900} width={960} height={180} fill="#3a3556" />
			<rect x={1380} y={760} width={360} height={150} rx={10} fill="#5a5478" />
			<ellipse cx={1500} cy={756} rx={110} ry={26} fill="#7fb8e0" stroke="#10132a" strokeWidth={5} />
			<line x1={960} y1={0} x2={960} y2={1080} stroke="#fff" strokeWidth={8} />
			<Actor who="hero" x={480} floor={900} s={1.2} facing={1} faceTurn={0.4} look={[0.6, 0.1]} expr="worried" pose={hp} uid="h109" />
			{wrapOn(hp, 480, 1.2)}
			<HT x={490} s={1.9} warn auto showBpm bpm={80} yy={900 - 157 * 1.2 - 164 * 1.2 - 100} />
			<Actor who="tema" x={1440} floor={900} s={1.2} facing={-1} faceTurn={0.4} look={[-0.6, 0.2]} expr="worried" pose={tp} uid="t109" />
			<Tag x={1440} y={900 - 157 * 1.2 - 164 * 1.2 - 100} value={28} f={f} s={1.9} warn auto showBpm bpm={92} />
			<Clock x={960} y={90} text="23:02" s={0.9} f={f} />
		</Board>
	);
};

const KitchenBg: React.FC = () => (
	<>
		<Kitchen night />
		<Svg>
			<ellipse cx={420} cy={612} rx={90} ry={22} fill="#7fb8e0" stroke="#10132a" strokeWidth={5} />
			<rect x={330} y={612} width={180} height={34} rx={8} fill="#cfd6e6" opacity={0.0} />
			<rect x={1700} y={330} width={200} height={570} fill="#2a2018" />
			<rect x={1716} y={346} width={168} height={554} fill="#ffd9a0" opacity={0.3} />
		</Svg>
	</>
);
const towel = (x: number, y: number) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={-18} y={0} width={36} height={80} rx={8} fill="#7fe0ff" stroke="#10132a" strokeWidth={3} />
		<rect x={-18} y={26} width={36} height={8} fill="#fff" opacity={0.7} />
	</g>
);

/* 110 + 111: Тёма шёпотом у таза с водой, полотенце в руке, за спиной дверь к брату */
const S110: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('110');
	let tp = idle(gf, 4);
	tp = hand(tp, 900, 1, -1, 'F', [900 - 70, hip(1) - 60 + Math.sin(e / 6) * 4], 1);
	const cam = usePush(camOn(1000, 560, 1.25), camOn(930, 590, 1.7));
	return (
		<Stage cam={cam} bg="#1b1d34" light={{x: 20, y: 8, o: 0.3}}>
			<Layer depth={1.6}>
				<KitchenBg />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="tema" x={900} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.6, 0.3]} expr="worried" mouth="flat" pose={tp} uid="t110" />
					{towel(900 - 74, hip(1) - 44)}
					<Tag x={900} y={tagY(1) - 14} value={28} f={f} s={1.35} warn auto showBpm bpm={92} />
					<Onoma x={1100} y={600} text="ТСС" t={e - 6} c="#c8d0ea" rot={6} size={46} />
				</Svg>
			</Layer>
			<Led text="23:03" />
		</Stage>
	);
};

/* 112 + 113: два раза начинал — каждые две минуты стоп; «Всё, Сань. Я выбываю.» — «29» мигает красным */
const S112: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('112');
	const e113 = f - at('113');
	const c = Math.min(e, 86) % 43;
	const walking = e < 86 && c > 14 && c < 36;
	const tx = e < 86 ? 900 + (c > 14 ? Math.min(1, (c - 14) / 14) * 500 * (c < 36 ? 1 : 1 - (c - 36) / 7) : 0) : 900;
	let tp = guard(idle(gf, 4), c < 15 && e < 86 ? 1 : 0);
	tp = hit(tp, c % 2 ? 'B' : 'F', 900, 1, -1, [750, 640], c < 15 && e < 86 ? env(c, 4, 10, 2, 4) : 0);
	const bpm = e >= 86 ? 90 : c < 15 ? 150 : interpolate(c, [15, 30], [150, 85], clamp);
	const num = e113 > 0 ? 29 : 28;
	const cam = usePush(camOn(1100, 560, 1.15), camOn(1050, 560, 1.4));
	return (
		<Stage cam={cam} bg="#1b1d34" light={{x: 20, y: 8, o: 0.3}}>
			<Layer depth={1.6}>
				<KitchenBg />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="tema" x={tx} floor={FL} s={1} facing={walking ? 1 : -1} faceTurn={0.4} look={[0.4, 0.2]} expr={e113 > 0 ? 'sad' : 'worried'} pose={walking ? {...idle(gf, 4), armF: [-20, 20]} : tp} uid="t112" vx={walking ? 5 : 0} />
					{towel(tx + (walking ? 60 : -74), hip(1) - 44)}
					<Tag x={tx} y={tagY(1) - 14} value={num} f={f} s={1.35} pop={1 + 0.25 * Math.exp(-Math.max(0, e113) / 5) * (e113 > 0 ? 1 : 0)} warn auto showBpm bpm={bpm} />
					{[20, 63].map((t) => e >= t && e < t + 26 ? pill(900, 330, 'РАУНД ✗', '#ff6a5a', grow(e, t, 8), 72) : null)}
				</Svg>
			</Layer>
			<Led text="23:04" />
		</Stage>
	);
};

/* 114: доска «ПРАВИЛО 3», приписка «не для него»; двадцать восемь дней сгорят */
const S114: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('114');
	const crack = grow(e, 118, 6);
	return (
		<Board tint="#1d3a33">
			<Chalk x={960} y={190} text="ПРАВИЛО 3:" k={grow(e, 4, 24)} size={110} anchor="middle" />
			<Chalk x={960} y={360} text="БОЛЕЗНЬ — ПАУЗА" k={grow(e, 24, 34)} size={130} anchor="middle" c="#9fd3ff" />
			<Chalk x={560} y={560} text="не для него" k={grow(e, 70, 28)} size={90} anchor="middle" c="#ffb0a0" />
			<path d="M740,540 C860,520 950,560 1040,640" stroke="#ffb0a0" strokeWidth={8} fill="none" strokeLinecap="round" opacity={grow(e, 96, 12)} />
			<g transform={`translate(${Math.sin(e * 3) * 5 * crack * (1 - grow(e, 130, 10))},0)`}>
				<Tag x={1220} y={680} value={29} f={f} s={2.2} warn heart={false} />
				{crack > 0.5 ? <path d="M1160,620 l28,40 l-22,26 l36,40" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" /> : null}
			</g>
		</Board>
	);
};

/* ----- 115–119: два пути на одном экране; всё, что было, остаётся ----- */
const PX = 12;
const Paths: React.FC<{zoom: number}> = ({zoom}) => {
	const {f, at} = useShot();
	const a0 = 150;
	const b0 = 1080;
	const mark = (x0: number, m: number) => x0 + m * PX;
	const bar = (x0: number, m0: number, m1: number, y: number, c: string, k: number, label?: string) => (
		<g opacity={Math.min(1, k * 3)}>
			<rect x={mark(x0, m0)} y={y} width={Math.max(0, (m1 - m0) * PX * k)} height={100} rx={16} fill={c} stroke="#10132a" strokeWidth={5} />
			{label && k > 0.7 ? <text x={mark(x0, m0) + 18} y={y + 68} fontSize={50} fontFamily={FONT} fontWeight={900} fill="#fff">{label}</text> : null}
		</g>
	);
	const k0 = grow(f, at('115') + 6, 14);
	const kA1 = grow(f, at('116') + 8, 40);
	const kA2 = grow(f, at('117') + 8, 50);
	const kA3 = grow(f, at('118') + 8, 50);
	const kB = grow(f, at('119') + 8, 60);
	const burn = grow(f, at('118') + 70, 10);
	const done1 = kA1 > 0.98;
	const lab = (x: number, y: number, t: string, c = '#c8d0ea', size = 42, anchor: 'start' | 'middle' | 'end' = 'start') => <text x={x} y={y} textAnchor={anchor} fontSize={size} fontFamily={FONT} fontWeight={900} fill={c}>{t}</text>;
	return (
		<g transform={`translate(960,540) scale(${zoom}) translate(-960,-540)`}>
			<g opacity={k0}>
				{lab(560, 200, 'ПУТЬ А', '#9fd3ff', 84, 'middle')}
				{lab(1500, 200, 'ПУТЬ Б', '#ffd34a', 84, 'middle')}
			</g>
			<line x1={960} y1={150} x2={960} y2={1050} stroke="#fff" strokeWidth={6} opacity={0.4} />
			{[a0, b0].map((x0) => (
				<g key={x0} opacity={k0}>
					<line x1={mark(x0, 55)} y1={500} x2={mark(x0, 55)} y2={1040} stroke="#ff4a3a" strokeWidth={6} strokeDasharray="14 10" />
					{lab(mark(x0, 55), 505, '00:00', '#ff4a3a', 56, 'middle')}
				</g>
			))}
			{/* путь А: свои раунды → бег → раунды Тёмы после полуночи */}
			{lab(a0, 560, '23:05 – 23:16', '#7be0a0', 76)}
			{bar(a0, 0, 11, 590, '#3aa37a', kA1)}
			{bar(a0, 11, 47, 590, '#2f6fd8', kA2, 'БЕГ 36 МИН')}
			{kA2 > 0.98 ? (
				<g>
					<polygon points={`${mark(a0, 47) - 16},700 ${mark(a0, 47) + 16},700 ${mark(a0, 47)},672`} fill="#9fd3ff" />
					{lab(mark(a0, 47) + 40, 790, '23:52', '#9fd3ff', 92, 'end')}
					{lab(mark(a0, 47) + 40, 850, 'У ДВЕРИ', '#9fd3ff', 52, 'end')}
				</g>
			) : null}
			{lab(mark(a0, 50) - 30, 985, '23:55 – 00:06', '#ff8a7a', 80, 'end')}
			{bar(a0, 50, 61, 920, '#e2483a', kA3)}
			{kA3 > 0.98 ? lab(mark(a0, 61) + 22, 1000, '✗', '#ff4a3a', 100) : null}
			<Tag x={a0 + 230} y={370} value={29} f={f} s={1.4} ok={done1} warn={!done1} heart={false} />
			<Tag x={a0 + 520} y={370} value={burn > 0.5 ? 0 : 29} f={f} s={1.4} warn={burn < 0.5} heart={false} />
			{/* путь Б: бежать сейчас */}
			{lab(b0, 560, '23:05 – 23:41', '#ffd34a', 76)}
			{bar(b0, 0, 36, 590, '#2f6fd8', kB, 'БЕЖАТЬ')}
			{kB > 0.98 ? (
				<g>
					<rect x={b0} y={760} width={760} height={150} rx={30} fill="#11142c" stroke="#ff6a5a" strokeWidth={8} />
					{lab(b0 + 380, 855, 'ТВОИ РАУНДЫ: 0 ИЗ 3', '#ff6a5a', 60, 'middle')}
				</g>
			) : null}
		</g>
	);
};
const mkPaths = (zoomA: number, zoomB: number): React.FC => () => {
	const {f, at} = useShot();
	const z = interpolate(f, [0, 150], [zoomA, zoomB], clamp);
	return (
		<Board tint="#13213a">
			<Paths zoom={z} />
			<Clock x={960} y={90} text="23:05" s={0.9} f={f} />
		</Board>
	);
};
const S115 = mkPaths(1, 1.03);
const S116 = mkPaths(1.03, 1.06);
const S117 = mkPaths(1.06, 1.04);
const S118 = mkPaths(1.04, 1.07);
const S119 = mkPaths(1.07, 1.02);

/* 120: «Закончить дома — и всё?» — мысль героя, смотрит на бинты */
const S120: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('120');
	let hp = idle(gf, 1);
	hp = reach(reach(hp, 'F', [40, -90], 1), 'B', [34, -94], 1);
	const cam = usePush(camOn(920, 560, 1.5), camOn(940, 560, 1.85));
	return (
		<Stage cam={cam} bg="#262b48" light={{x: 20, y: 8, o: 0.3}}>
			<Layer depth={1.6}>
				<Room f={f} night />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={800} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.5, 0.9]} expr="worried" pose={hp} uid="h120" />
					{wrapOn(hp, 800, HS)}
					<HT x={810} s={1.3} warn auto showBpm bpm={86} yy={tagY(HS) - 30} />
					<Bubble x={1130} y={400} w={300} h={160} t={e} thought tail={[-190, 120]}>
						<text x={0} y={34} textAnchor="middle" fontSize={110} fontFamily={FONT} fontWeight={900} fill="#10132a">?</text>
					</Bubble>
				</Svg>
			</Layer>
			<Led text="23:05" />
		</Stage>
	);
};

/* 121: бинты падают, дверь хлопает, мама выглядывает */
const S121: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('121');
	const drop = grow(e, 4, 14);
	const w = walkTo(e, 22, 50, 800, 1560, 1, 0.8);
	const cam = usePush(camOn(1000, 540, 1.2), camOn(1420, 540, 1.3));
	return (
		<Stage cam={cam} bg="#262b48" light={{x: 20, y: 8, o: 0.3}}>
			<Layer depth={1.6}>
				<Room f={f} night />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<rect x={1640} y={300} width={220} height={600} fill="#2a2018" />
					<rect x={1656} y={316} width={188} height={584} fill="#ffd9a0" opacity={0.3} />
					{[0, 1].map((i) => <path key={i} d={`M${760 + i * 40},${hip(HS) - 40 + drop * (FL - hip(HS) + 30)} q30,18 70,0`} stroke="#f2efe6" strokeWidth={16} fill="none" strokeLinecap="round" />)}
					<Actor who="hero" x={w.x} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.9, 0]} expr="angry" pose={w.pose} vx={w.vx} bob={w.bob} uid="h121" />
					<HT x={w.x + 10} s={1.2} warn auto showBpm bpm={90} yy={tagY(HS) - w.bob} />
					<Actor who="mom" x={1790} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.9, 0]} expr="wide" pose={idle(gf, 5)} uid="m121" />
					<Onoma x={1560} y={500} text="ХЛОП!" t={e - 52} c="#ffd34a" rot={-8} size={70} />
				</Svg>
			</Layer>
			<Led text="23:06" />
		</Stage>
	);
};

/* карта района: маршрут из дома к Тёме, 5 км; точка идёт по линии */
const ROUTE: [number, number][] = [[40, 280], [40, 170], [190, 170], [190, 70], [340, 70], [340, 180], [480, 180], [480, 50]];
export const RouteMap: React.FC<{p: number; w?: number}> = ({p, w = 520}) => {
	const segs = ROUTE.slice(1).map((q, i) => Math.hypot(q[0] - ROUTE[i][0], q[1] - ROUTE[i][1]));
	const tot = segs.reduce((a, b) => a + b, 0);
	let d = p * tot;
	let pos: [number, number] = ROUTE[0];
	const done: [number, number][] = [ROUTE[0]];
	for (let i = 0; i < segs.length; i++) {
		if (d <= segs[i]) {
			const t = d / segs[i];
			pos = [ROUTE[i][0] + (ROUTE[i + 1][0] - ROUTE[i][0]) * t, ROUTE[i][1] + (ROUTE[i + 1][1] - ROUTE[i][1]) * t];
			done.push(pos);
			break;
		}
		d -= segs[i];
		done.push(ROUTE[i + 1]);
		pos = ROUTE[i + 1];
	}
	return (
		<svg width={w} height={w * 0.66} viewBox="0 0 520 340" style={{background: '#10162f', border: '5px solid #7fe0ff', borderRadius: 22}}>
			{[60, 120, 180, 240, 300].map((y) => <line key={y} x1={0} y1={y} x2={520} y2={y} stroke="#2a3363" strokeWidth={3} />)}
			{[80, 160, 240, 320, 400, 480].map((x) => <line key={x} x1={x} y1={0} x2={x} y2={340} stroke="#2a3363" strokeWidth={3} />)}
			<polyline points={ROUTE.map((q) => q.join(',')).join(' ')} fill="none" stroke="#3a4a8a" strokeWidth={9} strokeLinejoin="round" />
			<polyline points={done.map((q) => q.join(',')).join(' ')} fill="none" stroke="#7fe0ff" strokeWidth={9} strokeLinejoin="round" />
			<circle cx={ROUTE[0][0]} cy={ROUTE[0][1]} r={13} fill="#5fe08a" />
			<circle cx={ROUTE[ROUTE.length - 1][0]} cy={ROUTE[ROUTE.length - 1][1]} r={13} fill="#ff6a5a" />
			<circle cx={pos[0]} cy={pos[1]} r={16} fill="#ffd34a" stroke="#10132a" strokeWidth={5} />
			<text x={500} y={330} textAnchor="end" fontSize={26} fontFamily={FONT} fontWeight={800} fill="#c8d0ea">5 КМ</text>
		</svg>
	);
};
const roundsPill = (
	<div style={{position: 'absolute', left: 48, bottom: 44, background: '#11142c', border: '5px solid #ff6a5a', borderRadius: 40, padding: '8px 30px', color: '#ff6a5a', fontFamily: FONT, fontWeight: 900, fontSize: 44}}>ТВОИ РАУНДЫ: 0 ИЗ 3</div>
);
const runPose = (ph: number): Pose => ({...walk(ph), lean: 11, head: -2});
const runP = (m: number) => (m - (23 * 60 + 5)) / 36;

/* 122: ночная улица, фонари, герой бежит; в углу карта района с точкой */
const S122: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('122');
	const m = interpolate(e, [0, 142], [23 * 60 + 6, 23 * 60 + 13], clamp);
	const ph = gf / 3.2;
	const cam = usePush(camOn(900, 560, 1.15), camOn(930, 560, 1.35));
	return (
		<Stage cam={cam} bg="#0b1030" light={{x: 70, y: 8, o: 0.3, night: true}}>
			<Layer depth={1.6}>
				<NightRoad scroll={gf * 14} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={860} floor={FL} s={HS} facing={1} faceTurn={0.3} look={[0.9, 0]} expr="worried" mouth="open" pose={runPose(ph)} vx={6} bob={Math.abs(Math.sin(ph)) * 8} uid="h122" />
					<HT x={870} s={1.25} auto showBpm bpm={interpolate(e, [0, 100], [110, 128], clamp)} yy={tagY(HS) - Math.abs(Math.sin(ph)) * 8} />
				</Svg>
			</Layer>
			<div style={{position: 'absolute', right: 44, top: 40}}>
				<RouteMap p={runP(m)} />
			</div>
			<Led text={hm(m)} />
			{roundsPill}
		</Stage>
	);
};
const hm = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(Math.floor(m) % 60).padStart(2, '0')}`;

/* 123: 23:23 — половина пути, ноги ватные, ровный темп; карта крупно, точка на середине */
const S123: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('123');
	const z = interpolate(e, [0, 158], [1, 1.07], clamp);
	const ph = gf / 3.6;
	return (
		<Board tint="#13213a">
			<g transform={`translate(960,540) scale(${z}) translate(-960,-540)`}>
				<foreignObject x={60} y={170} width={1040} height={700}>
					<RouteMap p={0.5} w={1040} />
				</foreignObject>
				<g transform="translate(1500,0)">
					<Actor who="hero" x={0} floor={950} s={1.25} facing={1} faceTurn={0.3} look={[0.7, 0.3]} expr="sleepy" mouth="open" pose={runPose(ph)} vx={0} bob={Math.abs(Math.sin(ph)) * 6} uid="h123" />
					<Tag x={0} y={950 - 157 * 1.25 - 164 * 1.25 - 90} value={counterAt(gf)} f={f} s={1.3} warn auto showBpm bpm={128} />
				</g>
				<text x={580} y={140} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#ffd34a">ПОЛОВИНА ПУТИ</text>
			</g>
			<Clock x={1500} y={110} text="23:23" s={1.4} f={f} />
		</Board>
	);
};

/* 124: сердце 130 жёлтое, мелко «НЕ СЧИТАЕТСЯ» */
const S124: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('124');
	const ph = gf / 3.2;
	const cam = usePush(camOn(920, 540, 1.35), camOn(940, 540, 1.7));
	return (
		<Stage cam={cam} bg="#0b1030" light={{x: 70, y: 8, o: 0.3, night: true}}>
			<Layer depth={1.6}>
				<NightRoad scroll={gf * 14} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={760} floor={FL} s={HS} facing={1} faceTurn={0.3} look={[0.9, 0.2]} expr="worried" mouth="open" pose={runPose(ph)} vx={6} bob={Math.abs(Math.sin(ph)) * 8} uid="h124" />
					<HT x={780} s={1.7} auto showBpm bpm={130} yy={tagY(HS) - 50} />
					{pill(1130, 480, 'НЕ СЧИТАЕТСЯ', '#ffd34a', grow(e, 26, 10), 40)}
				</Svg>
			</Layer>
			<Led text="23:26" />
			{roundsPill}
		</Stage>
	);
};

/* 125: 23:30 — «11 + 11 > 19» мелом; вопрос зрителю на весь экран */
const S125: React.FC = () => {
	const {f, at} = useShot();
	const e = f - at('125');
	const q = grow(e, 70, 10);
	return (
		<Board tint="#1d3a33">
			<g opacity={1 - q * 0.85}>
				<Chalk x={960} y={500} text="11 + 11 > 19" k={grow(e, 8, 40)} size={220} anchor="middle" c="#ffd34a" />
			</g>
			<g opacity={q}>
				<Chalk x={960} y={360} text="КАК УМЕСТИТЬ" k={grow(e, 72, 20)} size={130} anchor="middle" />
				<Chalk x={960} y={530} text="ДВА РАЗА ПО 11" k={grow(e, 86, 20)} size={130} anchor="middle" c="#ffd34a" />
				<Chalk x={960} y={700} text="В 11 МИНУТ?" k={grow(e, 100, 20)} size={130} anchor="middle" c="#ffd34a" />
			</g>
			<Clock x={300} y={110} text="23:30" s={1.1} f={f} />
		</Board>
	);
};

/* 126: «Шнурок!» — флэшбек: кадр со шнурком из части 6, лицо героя, пауза, ускорение (сепия) */
const S126: React.FC = () => {
	const {f, gf} = useShot();
	const t = f;
	const camA = usePush(camOn(1120, 710, 2.0), camOn(1140, 715, 2.4));
	const camB = usePush(camOn(1480, 560, 3.0), camOn(1480, 556, 3.25));
	const cam = t < 20 ? camA : camB;
	const seat = FL - 79;
	const pose: Pose = {...FS, lean: 40, head: 8, legB: [80, 80], legF: [84, 84]};
	const whoosh = grow(t, 36, 6);
	return (
		<Stage cam={cam} bg="#3b4a78" light={{x: 60, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Facade f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="tema" x={900} floor={FL} seat={seat} s={1} facing={1} faceTurn={0.3} look={[0.5, 0.9]} expr="worried" pose={reach(reach(pose, 'F', [76, 74], 1), 'B', [70, 70], 1)} uid="t126" />
					<Knot x={1300} y={700} s={0.9} e={t} />
					<Actor who="hero" x={1480} floor={FL} s={HS} facing={-1} faceTurn={0.5} look={[-0.7, 0.2]} expr={t >= 20 ? 'wide' : 'angry'} mouth={t >= 20 ? 'open' : undefined} pose={reach(reach(idle(gf, 1), 'F', toLocal(1380, 620, 1480, hip(HS), HS, -1), 1), 'B', toLocal(1372, 690, 1480, hip(HS), HS, -1), 1)} uid="h126" />
				</Svg>
			</Layer>
			<div style={{position: 'absolute', inset: 0, background: 'rgba(150,105,50,0.5)', mixBlendMode: 'multiply'}} />
			{whoosh > 0 ? (
				<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: whoosh}}>
					{Array.from({length: 16}).map((_, i) => <rect key={i} x={((i * 311 + t * 90) % 2200) - 200} y={40 + i * 64} width={500 + (i % 4) * 160} height={6} fill="#fff" opacity={0.7} />)}
				</svg>
			) : null}
		</Stage>
	);
};

export const PART78B: ShotDef[] = [
	{at: '109', C: S109, own: true, ownCuts: []},
	{at: '110', C: S110, whip: true},
	{at: '112', C: S112},
	{at: '114', C: S114, own: true, ownCuts: []},
	{at: '115', C: S115, own: true, ownCuts: []},
	{at: '116', C: S116, own: true, ownCuts: []},
	{at: '117', C: S117, own: true, ownCuts: []},
	{at: '118', C: S118, own: true, ownCuts: []},
	{at: '119', C: S119, own: true, ownCuts: []},
	{at: '120', C: S120, whip: true},
	{at: '121', C: S121},
	{at: '122', C: S122, whip: true},
	{at: '123', C: S123, own: true, ownCuts: []},
	{at: '124', C: S124, whip: true},
	{at: '125', C: S125, own: true, ownCuts: []},
	{at: '126', off: -16, C: S126, whip: true},
];
