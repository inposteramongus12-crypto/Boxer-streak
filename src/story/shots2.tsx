import React from 'react';
import {interpolate} from 'remotion';
import {Pose} from '../engine/Stickman';
import {blend, env, gesture, handshake, idle, reach, walk, walkTo} from '../kit/actions';
import {Actor, counterAt, useShot, useSpeaking} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Layer, Stage, Svg, camOn, clamp, ease, flash, usePush} from '../kit/kit';
import {Callout} from '../kit/graphics';
import {Kitchen} from '../kit/sets';
import {Board, FONT} from '../kit/ui';
import {Onoma} from '../reference/PauseTime';
import {Chandelier, Clock, Rail, Room, STEP, Stadium, StairDown, Tag, Yard, heartColor, railY, stepY} from './places';
import {FL, HS, HT, Rope, grow, guard, hip, hit, tagY} from './common';
import {toLocal} from '../engine/Stickman';

/* Части 2 и 3 (реплики 026–059). Герой Саня — жёлтый, Тёма — красный.
   Пульс по сценарию: покой 80 (серое сердце), считается ≥150 (красное), ровный бег 125 (жёлтое). */
const FS: Pose = {lean: -2, head: 0, armB: [20, 40], armF: [30, 40], legB: [90, 0], legF: [92, 0]}; // сидит на полу, ноги прямо вперёд
const SEAT = FL - 34;
const shadow = (x: number, k = 1) => <ellipse cx={x} cy={FL + 4} rx={70 * k} ry={11} fill="#000" opacity={0.22} style={{filter: 'blur(5px)'}} />;
const Mat: React.FC<{x0: number; x1: number; roll?: number}> = ({x0, x1, roll = 0}) => {
	const cx = x0 + roll * (x1 - x0);
	const r = 6 + roll * 34;
	return (
		<g>
			{roll < 0.98 ? (
				<>
					<rect x={cx} y={FL - 12} width={x1 - cx} height={12} rx={4} fill="#3fc1c9" stroke="#10132a" strokeWidth={3} />
					<rect x={cx} y={FL - 8} width={x1 - cx} height={3} fill="#e6fbff" opacity={0.6} />
				</>
			) : null}
			{roll > 0.02 ? (
				<g>
					<circle cx={cx} cy={FL - r} r={r} fill="#3fc1c9" stroke="#10132a" strokeWidth={3} />
					<circle cx={cx} cy={FL - r} r={r * 0.55} fill="none" stroke="#10132a" strokeWidth={3} opacity={0.6} />
				</g>
			) : null}
		</g>
	);
};
const Chalk: React.FC<{x: number; y: number; text: string; k: number; size?: number; c?: string; anchor?: 'start' | 'middle'}> = ({x, y, text, k, size = 80, c = '#f4f1e6', anchor = 'start'}) => (
	<text x={x} y={y} fontSize={size} fontFamily={FONT} fontWeight={800} fill={c} opacity={0.95} textAnchor={anchor}>
		{text.slice(0, Math.ceil(text.length * k))}
	</text>
);
const heartPath = 'M0,60 C-120,-20 -80,-110 -32,-96 C-14,-92 0,-72 0,-60 C0,-72 14,-92 32,-96 C80,-110 120,-20 0,60 Z';
const pill = (x: number, y: number, text: string, c: string, k: number, size = 44) => {
	const w = text.length * size * 0.62 + 50;
	return (
		<g transform={`translate(${x},${y}) scale(${k})`} opacity={Math.min(1, k * 1.4)}>
			<rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.6} rx={size * 0.8} fill="#11142c" stroke={c} strokeWidth={5} />
			<text x={0} y={size * 0.22} textAnchor="middle" fontSize={size} fontFamily={FONT} fontWeight={900} fill={c}>
				{text}
			</text>
		</g>
	);
};
const hand = (p: Pose, x: number, s: number, facing: 1 | -1, side: 'F' | 'B', t: [number, number], k: number) => reach(p, side, toLocal(t[0], t[1], x, hip(s), s, facing), k);

/* ================= ЧАСТЬ 2 ================= */

/* 026: День третий — спускается по лестнице боком, держась за перила обеими руками */
const S26: React.FC = () => {
	const {f, at} = useShot();
	const e = f - at('026');
	const prog = [0, 1, 2].map((k) => grow(e, 10 + k * 36, 16));
	const idx = prog[0] + prog[1] + prog[2];
	const x = STEP.x0 + 95 + idx * STEP.w;
	const fl = stepY(0) + idx * STEP.h;
	const stepping = prog.some((p) => p > 0.02 && p < 0.98);
	let p: Pose = {...idle(f, 1), lean: -7, head: 6, legF: [stepping ? 14 : 3, 4], legB: [stepping ? -8 : -3, 4]};
	p = hand(p, x, HS, 1, 'F', [x + 70, railY(x + 70) + 6], 1);
	p = hand(p, x, HS, 1, 'B', [x - 10, railY(x - 10) + 6], 1);
	const wince = Math.sin(e / 5) > 0.2 || stepping;
	const cam = camOn(x + 160, fl - 230, 1.3 + 0.1 * (e / 125));
	return (
		<Stage cam={cam} bg="#58806a" light={{x: 30, y: 5, o: 0.35}}>
			<Layer depth={1.6}>
				<StairDown />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={x} floor={fl} s={HS} facing={1} faceTurn={0.3} look={[0.3, 0.6]} expr="worried" mouth={wince ? 'frown' : 'flat'} pose={p} squash={stepping ? 0.025 : 0} uid="h26" />
					<Rail />
					<HT x={x + 10} s={0.95} heart={false} yy={fl - 157 * HS - 164 * HS - 118} />
					<Onoma x={x + 40} y={fl - 330} text="ОЙ" t={e - 52} c="#ff8a7a" rot={-8} size={54} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 027: кривая крепатуры 24–72 ч, точка «ТЫ» на пике */
const S27: React.FC = () => {
	const {f, at} = useShot();
	const e = f - at('027');
	const X0 = 260;
	const X1 = 1660;
	const Y0 = 780;
	const pain = (h: number) => Math.exp(-(((h - 48) / 22) ** 2));
	const px = (h: number) => X0 + (h / 96) * (X1 - X0);
	const py = (h: number) => Y0 - 440 * pain(h);
	const draw = grow(e, 14, 70);
	const hMax = 96 * draw;
	const pts = Array.from({length: 97}).filter((_, h) => h <= hMax).map((_, h) => `${h === 0 ? 'M' : 'L'}${px(h)},${py(h)}`).join(' ');
	const flag = grow(e, 92, 10);
	return (
		<Board tint="#2a1a3a">
			<text x={960} y={120} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#fff">
				БОЛЬ В МЫШЦАХ ПОСЛЕ НАГРУЗКИ
			</text>
			<rect x={px(24)} y={200} width={px(72) - px(24)} height={Y0 - 200} fill="#ff6a5a" opacity={0.14} />
			<text x={px(24) + 18} y={Y0 - 22} fontSize={40} fontFamily={FONT} fontWeight={800} fill="#ff9a8a">
				24–72 ЧАСА
			</text>
			<line x1={X0} y1={Y0} x2={X1 + 20} y2={Y0} stroke="#c8d0ea" strokeWidth={6} />
			{[0, 24, 48, 72, 96].map((h) => (
				<g key={h}>
					<line x1={px(h)} y1={Y0} x2={px(h)} y2={Y0 + 16} stroke="#c8d0ea" strokeWidth={5} />
					<text x={px(h)} y={Y0 + 62} textAnchor="middle" fontSize={40} fontFamily={FONT} fontWeight={700} fill="#c8d0ea">
						{h}
					</text>
				</g>
			))}
			<text x={X1} y={Y0 + 120} textAnchor="end" fontSize={36} fontFamily={FONT} fontWeight={700} fill="#8f98bd">
				ЧАСОВ ПОСЛЕ НАГРУЗКИ
			</text>
			<path d={pts} stroke="#ff6a5a" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			<g opacity={flag} transform={`translate(${px(48)},${py(48)})`}>
				<circle r={20} fill="#ffc94a" stroke="#10132a" strokeWidth={5} />
				<line x1={0} y1={-20} x2={0} y2={-120} stroke="#ffc94a" strokeWidth={6} />
				<polygon points="0,-120 120,-100 0,-80" fill="#ffc94a" />
				<text x={14} y={-92} fontSize={34} fontFamily={FONT} fontWeight={900} fill="#10132a">
					ТЫ
				</text>
			</g>
		</Board>
	);
};

/* 028: вечер, комната, коврик — тянется к носкам и не дотягивается */
const S28: React.FC = () => {
	const {f, at} = useShot();
	const e = f - at('028');
	const x = 860;
	const cyc = (Math.sin(e / 8 - 1.2) + 1) / 2; // накл. вперёд и обратно
	const reachK = 0.35 + 0.65 * cyc;
	let p: Pose = {...FS, lean: 8 + 48 * reachK, head: 10 * reachK};
	const toes: [number, number] = [157 * HS * 0.78 + 4, 6]; // кисть тянется, но короче носка
	p = reach(reach(p, 'F', toes, 1), 'B', [toes[0] - 6, toes[1] - 8], 1);
	const cam = usePush(camOn(980, 690, 1.5), camOn(1020, 700, 1.85));
	return (
		<Stage cam={cam} bg="#e9d8bd" light={{x: 20, y: 8, o: 0.4}}>
			<Layer depth={1.6}>
				<Room f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Mat x0={520} x1={1260} />
					{shadow(x + 80, 2)}
					<Actor who="hero" x={x} floor={FL} seat={SEAT} s={HS} facing={1} faceTurn={0.3} look={[0.5, 0.7]} expr={cyc > 0.7 ? 'worried' : 'normal'} mouth={cyc > 0.7 ? 'frown' : undefined} pose={p} uid="h28" />
					<HT x={x + 60} s={0.95} heart={false} yy={SEAT - 164 * HS - 115 + 30 * reachK} />
					<line x1={x + 157 * HS * 0.78 + 20} y1={FL - 40} x2={x + 157 * HS + 10} y2={FL - 40} stroke="#ff8a7a" strokeWidth={6} strokeDasharray="10 8" opacity={0.0 + 0.9 * grow(e, 60, 10)} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 029: телефон — поиск и реклама шагомеров, герой закатывает глаза */
const S29: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('029');
	const q1 = 'что считает счётчик';
	const q2 = 'над головой';
	const n = Math.floor(interpolate(e, [8, 62], [0, q1.length + q2.length], clamp));
	const roll = grow(e, 80, 30);
	return (
		<Board tint="#1a2150">
			<rect x={420} y={90} width={460} height={900} rx={56} fill="#0c1022" stroke="#8f98bd" strokeWidth={8} />
			<rect x={444} y={130} width={412} height={820} rx={34} fill="#f4f6fb" />
			<rect x={470} y={170} width={360} height={110} rx={30} fill="#e2e6f2" />
			<text x={494} y={216} fontSize={32} fontFamily={FONT} fontWeight={600} fill="#2a2f45">
				{q1.slice(0, n)}
			</text>
			<text x={494} y={256} fontSize={32} fontFamily={FONT} fontWeight={600} fill="#2a2f45">
				{q2.slice(0, Math.max(0, n - q1.length))}
			</text>
			<g opacity={grow(e, 66, 10)} transform={`translate(0,${(1 - grow(e, 66, 10)) * 30})`}>
				<rect x={470} y={320} width={360} height={300} rx={22} fill="#fff" stroke="#ffb02e" strokeWidth={6} />
				<text x={492} y={362} fontSize={26} fontFamily={FONT} fontWeight={800} fill="#c9342a">
					РЕКЛАМА
				</text>
				<rect x={500} y={390} width={120} height={190} rx={24} fill="#10132a" />
				<text x={560} y={470} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={900} fill="#7fe0ff">
					10 000
				</text>
				<text x={560} y={510} textAnchor="middle" fontSize={22} fontFamily={FONT} fontWeight={700} fill="#8f98bd">
					ШАГОВ
				</text>
				<text x={650} y={450} fontSize={42} fontFamily={FONT} fontWeight={900} fill="#10132a">
					ШАГОМЕР
				</text>
				<rect x={650} y={480} width={150} height={70} rx={14} fill="#e2483a" />
				<text x={725} y={528} textAnchor="middle" fontSize={44} fontFamily={FONT} fontWeight={900} fill="#fff">
					−50%
				</text>
			</g>
			<rect x={470} y={650} width={360} height={80} rx={16} fill="#e9ecf6" opacity={grow(e, 78, 10)} />
			<rect x={470} y={750} width={360} height={80} rx={16} fill="#e9ecf6" opacity={grow(e, 86, 10)} />
			<g>
				<Actor who="hero" x={1400} floor={1000} s={1.3} facing={-1} faceTurn={0.4} look={[-Math.cos(roll * 6.3) * 0.9, -Math.sin(roll * 6.3) * 0.9]} expr="sleepy" mouth="flat" pose={reach(idle(gf, 1), 'F', [60, -120], 0)} uid="h29" />
				<HT x={1400} s={1.1} heart={false} yy={1000 - 157 * 1.3 - 164 * 1.3 - 120} />
			</g>
		</Board>
	);
};

/* 030: рядом с табличкой впервые появляется сердце, серое, 80 в минуту */
const S30: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('030');
	const k = grow(e, 22, 14);
	const cam = usePush(camOn(960, 520, 1.6), camOn(990, 500, 2.05));
	return (
		<Stage cam={cam} bg="#e9d8bd" light={{x: 20, y: 8, o: 0.4}}>
			<Layer depth={1.6}>
				<Room f={f} night />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={900} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.6, -0.5]} expr="wide" pose={idle(gf, 1)} uid="h30" />
					<HT x={900} s={1.55} auto showBpm bpm={80} heartK={k} yy={tagY(HS) - 52} />
					{k > 0 && k < 1 ? <circle cx={1080} cy={tagY(HS) - 56} r={20 + k * 90} fill="none" stroke="#c8cde0" strokeWidth={6 * (1 - k)} opacity={1 - k} /> : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 031: 23:45, табличка мигает красным, «НЕ ЗАСЧИТАНО» */
const S31: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('031');
	const x = 860;
	const p: Pose = {...FS, lean: -6, head: 4};
	const cam = usePush(camOn(960, 560, 1.15), camOn(940, 520, 1.4));
	return (
		<Stage cam={cam} bg="#262b48" light={{x: 20, y: 8, o: 0.3}}>
			<Layer depth={1.6}>
				<Room f={f} night />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<Clock x={1000} y={225} text="23:45" s={1.5} blink f={f} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Mat x0={520} x1={1260} />
					{shadow(x + 80, 2)}
					<Actor who="hero" x={x} floor={FL} seat={SEAT} s={HS} facing={1} faceTurn={0.4} look={[0.4, 0.2]} expr="sleepy" mouth="flat" pose={p} uid="h31" />
					<HT x={x} s={1.05} warn auto showBpm bpm={80} yy={SEAT - 164 * HS - 125} />
					{pill(1000, 345, 'НЕ ЗАСЧИТАНО', '#ff6a5a', grow(e, 34, 10), 42)}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 032 HERO: «Что?! Я же тянулся!» — вскакивает, хватается за голову, коврик сворачивается сам */
const S32: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('032');
	const up = grow(e, 4, 12);
	const x = 860;
	const seat = interpolate(up, [0, 1], [SEAT, FL - 157 * HS]) - 50 * Math.sin(Math.min(1, up) * Math.PI);
	const base = blend(FS, idle(gf, 1), up);
	const p = gesture('handsOnHead', base, grow(e, 14, 8), f);
	const cam = usePush(camOn(960, 540, 1.35), camOn(940, 520, 1.55));
	return (
		<Stage cam={cam} bg="#262b48" light={{x: 20, y: 8, o: 0.3}}>
			<Layer depth={1.6}>
				<Room f={f} night />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<Clock x={1000} y={225} text="23:45" s={1.5} blink f={f} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Mat x0={520} x1={1260} roll={grow(e, 20, 26)} />
					{shadow(x, up > 0.6 ? 1 : 2)}
					<Actor who="hero" x={x} floor={FL} seat={seat} s={HS} facing={1} faceTurn={0.4} look={[0.3, -0.2]} expr="wide" mouth="open" pose={p} uid="h32" />
					<HT x={x} s={1.05} warn auto showBpm bpm={80} yy={seat - 164 * HS - 125} />
					{pill(1000, 345, 'НЕ ЗАСЧИТАНО', '#ff6a5a', 1, 42)}
					<Onoma x={x - 230} y={seat - 190} text="ЧТО?!" t={e - 8} c="#ffd34a" rot={-8} size={70} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 033: сердце пульсирует серым, рядом мелом «80 — мало» */
const S33: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('033');
	const beat = 1 + 0.12 * Math.max(0, Math.sin(((f % 22.5) / 22.5) * Math.PI * 2)) ** 3;
	return (
		<Board tint="#1d3a33">
			<g transform={`translate(620,580) scale(${3.1 * beat})`}>
				<path d={heartPath} fill="#8c93a8" stroke="#10132a" strokeWidth={6} />
			</g>
			<Chalk x={1020} y={500} text="80 —" k={grow(e, 20, 20)} size={170} />
			<Chalk x={1020} y={680} text="МАЛО" k={grow(e, 44, 24)} size={170} c="#ff8a7a" />
			<Tag x={620} y={120} value={counterAt(gf)} f={f} s={1.5} warn heart={false} />
		</Board>
	);
};

/* кухня: люстра качается от прыжков */
const mkKitchen = (variant: 'a' | 'b', first: string): React.FC => () => {
	const {f, gf, at} = useShot();
	const e = f - at('034'); // кадров от начала реплики 034
	const jmp = Math.abs(Math.sin(e / 4.6));
	const ang = 9 * Math.sin(e / 9.2) * Math.min(1, e / 40 + 0.25);
	let p = reach(reach(idle(gf, 1), 'F', [34, -20], 1), 'B', [22, -22], 1);
	p = {...p, legF: [p.legF[0] + 6, 22 * jmp], legB: [p.legB[0] - 4, 22 * jmp]};
	const bpm = interpolate(e, [0, 110, 153, 170, 195, 225], [80, 105, 112, 122, 140, 150], clamp);
	const secs = Math.max(0, 180 - Math.floor(e / 30));
	const cam = variant === 'a' ? usePush(camOn(900, 560, 1.15), camOn(860, 540, 1.38)) : usePush(camOn(800, 500, 1.85), camOn(800, 480, 2.2));
	return (
		<Stage cam={cam} bg="#2a2a48" light={{x: 20, y: 8, o: 0.3}}>
			<Layer depth={1.6}>
				<Kitchen night />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Chandelier x={1100} a={ang} />
					{variant === 'a' ? pill(430, 360, `РАУНД 1  ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`, '#7fe0ff', grow(e, 6, 10), 40) : null}
					<rect x={380} y={598} width={50} height={42} rx={8} fill="#10132a" stroke="#7fe0ff" strokeWidth={3} />
					{shadow(760)}
					<Actor who="hero" x={760} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.4, 0.3]} expr="normal" mouth="open" pose={p} bob={jmp * 14} uid={'h34' + variant} />
					<Rope p={p} x={760} s={HS} facing={1} a={e / 4.6} c="#ffd34a" />
					<HT x={760} s={variant === 'a' ? 1 : 1.35} auto showBpm bpm={bpm} yy={tagY(HS) - jmp * 14 - (variant === 'a' ? 0 : 36)} />
				</Svg>
			</Layer>
		</Stage>
	);
};
const S34 = mkKitchen('a', '034');
const S35 = mkKitchen('b', '035');

/* 036: мама в халате — смотрит на героя, на люстру, молча уходит */
const S36: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('036');
	const e34 = f - at('034');
	const jmp = Math.abs(Math.sin(e34 / 4.6));
	const ang = 12 * Math.sin(e34 / 9.2);
	let p = reach(reach(idle(gf, 1), 'F', [34, -20], 1), 'B', [22, -22], 1);
	p = {...p, legF: [p.legF[0] + 6, 22 * jmp], legB: [p.legB[0] - 4, 22 * jmp]};
	const inW = walkTo(e, 6, 40, 2150, 1480, 5, 0.26);
	const outW = walkTo(e, 118, 154, 1480, 2200, 5, 0.26);
	const mx = e < 118 ? inW.x : outW.x;
	const mp = e < 118 ? inW.pose : outW.pose;
	const lookHero = grow(e, 44, 6);
	const lookUp = grow(e, 84, 8) * (1 - grow(e, 112, 6));
	const cam = usePush(camOn(1120, 560, 1.15), camOn(1180, 545, 1.35));
	return (
		<Stage cam={cam} bg="#2a2a48" light={{x: 20, y: 8, o: 0.3}}>
			<Layer depth={1.6}>
				<Kitchen night />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Chandelier x={1100} a={ang} />
					{shadow(760)}
					<Actor who="hero" x={760} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.4, 0.3]} expr="normal" mouth="open" pose={p} bob={jmp * 14} uid="h36" />
					<Rope p={p} x={760} s={HS} facing={1} a={e34 / 4.6} c="#ffd34a" />
					<HT x={760} s={1} auto showBpm bpm={150} yy={tagY(HS) - jmp * 14} />
					<Actor who="mom" x={mx} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.9 + lookUp * 0.7, -lookUp * 0.95]} expr={lookHero > 0.5 && lookUp < 0.3 ? 'angry' : 'normal'} mouth="flat" pose={gesture('armsCrossed', mp, grow(e, 40, 8) * (1 - grow(e, 114, 4)), f)} vx={inW.vx} bob={inW.bob} uid="m36" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 037: 23:56, табличка зелёная, герой падает на пол звёздочкой */
const S37: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('037');
	const x = 760;
	const fall = grow(e, 30, 12);
	const ok = e > 22;
	const jmp = e < 30 ? Math.abs(Math.sin(e / 4.6)) : 0;
	let p = reach(reach(idle(gf, 1), 'F', [34, -20], 1), 'B', [22, -22], 1);
	p = {...p, legF: [p.legF[0] + 6, 22 * jmp], legB: [p.legB[0] - 4, 22 * jmp]};
	p = {...p, armF: [p.armF[0] + (150 - p.armF[0]) * fall, p.armF[1] * (1 - fall)], armB: [p.armB[0] + (-150 - p.armB[0]) * fall, p.armB[1] * (1 - fall)], legF: [p.legF[0] + (24 - p.legF[0]) * fall, 0], legB: [p.legB[0] + (-24 - p.legB[0]) * fall, 0]};
	const rot = -90 * fall;
	const th = (rot * Math.PI) / 180;
	const ty = tagY(HS) - FL;
	const tx = x - ty * Math.sin(th);
	const tyy = FL + ty * Math.cos(th) - 90 * fall;
	const cam = usePush(camOn(900, 560, 1.2), camOn(860, 640, 1.45));
	return (
		<Stage cam={cam} bg="#2a2a48" light={{x: 20, y: 8, o: 0.3}}>
			<Layer depth={1.6}>
				<Kitchen night />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<Clock x={430} y={250} text="23:56" s={1.35} f={f} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Chandelier x={1100} a={(12 * Math.sin(e / 9.2)) * (1 - fall) + 3 * Math.sin(e / 12) * fall} />
					{shadow(x, 1 + fall)}
					<g transform={`rotate(${rot} ${x} ${FL})`}>
						<Actor who="hero" x={x} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.4, 0.3]} expr={fall > 0.5 ? 'sleepy' : 'normal'} mouth={fall > 0.5 ? 'open' : 'open'} pose={p} bob={jmp * 14} shadow={false} uid="h37" />
					</g>
					<Rope p={p} x={x} s={HS} facing={1} a={e / 4.6} c="#ffd34a" k={fall < 0.05 ? 1 : 0} />
					<HT x={tx} s={1} ok={ok} auto showBpm bpm={fall > 0.5 ? 110 : 150} yy={tyy} pop={1 + 0.25 * Math.exp(-Math.max(0, e - 22) / 5) * (ok ? 1 : 0)} />
					{ok && e < 40 ? <circle cx={tx} cy={tyy} r={50 + (e - 22) * 9} fill="none" stroke="#5fe08a" strokeWidth={8 * (1 - (e - 22) / 18)} opacity={Math.max(0, 1 - (e - 22) / 18)} /> : null}
					<Onoma x={x - 120} y={FL - 80} text="БУХ" t={e - 40} c="#ffd34a" rot={-6} size={64} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 038: доска мелом «ПРАВИЛО 1: СЧИТАЕТСЯ ПУЛЬС» и сердце */
const S38: React.FC = () => {
	const {f, at} = useShot();
	const e = f - at('038');
	const beat = 1 + 0.13 * Math.max(0, Math.sin(((f % 12) / 12) * Math.PI * 2)) ** 3;
	const draw = grow(e, 70, 50);
	return (
		<Board tint="#1d3a33">
			<Chalk x={960} y={190} text="ПРАВИЛО 1:" k={grow(e, 8, 30)} size={110} anchor="middle" />
			<Chalk x={960} y={330} text="СЧИТАЕТСЯ ПУЛЬС" k={grow(e, 36, 40)} size={140} anchor="middle" c="#ffd34a" />
			<g transform={`translate(960,700) scale(${2.2 * beat})`}>
				<path d={heartPath} fill="none" stroke="#f4f1e6" strokeWidth={9} strokeLinejoin="round" strokeDasharray={900} strokeDashoffset={900 * (1 - draw)} />
				<path d={heartPath} fill="#ff4a5e" opacity={grow(e, 118, 20) * 0.9} />
			</g>
		</Board>
	);
};

/* ================= ЧАСТЬ 3 ================= */
const YSKY = '#4a5a8a';
// Тёма: красный, табличка идёт вместе с героем (то же число)
const TX0 = 1120;
const notebook = (x: number, y: number, s = 1) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-34} y={-46} width={68} height={92} rx={6} fill="#f4f1e6" stroke="#10132a" strokeWidth={4} />
		<rect x={-34} y={-46} width={12} height={92} rx={4} fill="#2f6fd8" />
		{[-24, -8, 8, 24].map((yy) => (
			<line key={yy} x1={-14} y1={yy} x2={26} y2={yy} stroke="#9aa3b5" strokeWidth={3} />
		))}
	</g>
);
const penEar = (x: number, y: number) => <line x1={x} y1={y} x2={x + 26} y2={y - 12} stroke="#2f6fd8" strokeWidth={7} strokeLinecap="round" />;

/* 039: двор за гаражами — Тёма с блокнотом и ручкой за ухом, Саня рядом */
const S39: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('039');
	const scribble = Math.sin(e / 2.2) * 6;
	let tp = idle(gf, 4);
	tp = hand(tp, TX0, 1, -1, 'F', [TX0 - 52, FL - 157 - 60 + scribble * 0.3], 1);
	const hp = gesture('armsCrossed', idle(gf, 1), grow(e, 40, 12), f);
	const cam = usePush(camOn(700, 560, 1.0), camOn(980, 540, 1.35));
	return (
		<Stage cam={cam} bg={YSKY} light={{x: 70, y: 8, o: 0.4}}>
			<Layer depth={1.6}>
				<Yard f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={780} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.8, 0]} expr="normal" pose={hp} uid="h39" />
					<HT x={790} s={0.95} auto bpm={80} />
					<Actor who="tema" x={TX0} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.2, 0.5]} expr="normal" pose={tp} uid="t39" />
					{penEar(TX0 + 36, FL - 157 - 164 + 6)}
					{notebook(TX0 - 70, FL - 157 - 52 + scribble * 0.3)}
					<HT x={TX0} s={0.95} auto bpm={80} yy={tagY(1)} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 040 TEMA: «Опыт первый» — крупно блокнот, на странице «ОПЫТ 1» */
const S40: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('040');
	const scribble = Math.sin(e / 2) * 5;
	let tp = idle(gf, 4);
	tp = hand(tp, TX0, 1, -1, 'F', [TX0 - 52, FL - 157 - 60 + scribble * 0.3], 1);
	const pop = grow(e, 16, 10);
	const cam = usePush(camOn(1120, 560, 1.7), camOn(1180, 540, 1.95));
	return (
		<Stage cam={cam} bg={YSKY} light={{x: 70, y: 8, o: 0.4}}>
			<Layer depth={1.6}>
				<Yard f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="tema" x={TX0} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.2, 0.6]} expr="normal" pose={tp} uid="t40" />
					{penEar(TX0 + 36, FL - 157 - 164 + 6)}
					{notebook(TX0 - 70, FL - 157 - 52 + scribble * 0.3)}
					<HT x={TX0} s={1.05} auto bpm={80} yy={tagY(1) - 6} />
					<g transform={`translate(${TX0 - 235},${470}) rotate(-4) scale(${pop})`} opacity={pop}>
						<rect x={-130} y={-150} width={260} height={310} rx={10} fill="#f4f1e6" stroke="#10132a" strokeWidth={5} />
						{[-90, -40, 10, 60, 110].map((yy) => (
							<line key={yy} x1={-110} y1={yy} x2={110} y2={yy} stroke="#9aa3b5" strokeWidth={3} />
						))}
						<text x={0} y={-82} textAnchor="middle" fontSize={78} fontFamily="'Caveat', cursive" fontWeight={700} fill="#2f6fd8">
							ОПЫТ 1
						</text>
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 041: сплит «1 РАУНД ✗» и «2 РАУНДА ✗», таблички мигают красным */
const S41: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('041');
	const panel = (cx: number, label: string, rounds: number, k: number, uid: string) => {
		const jmp = Math.abs(Math.sin((e + k * 7) / 4.6));
		let p = reach(reach(idle(gf, 1 + k), 'F', [34, -20], 1), 'B', [22, -22], 1);
		p = {...p, legF: [p.legF[0] + 6, 22 * jmp], legB: [p.legB[0] - 4, 22 * jmp]};
		const sh = grow(e, rounds === 1 ? 36 : 74, 10);
		return (
			<g>
				<text x={cx} y={190} textAnchor="middle" fontSize={92} fontFamily={FONT} fontWeight={900} fill="#fff" opacity={sh}>
					{label}
				</text>
				<text x={cx} y={330} textAnchor="middle" fontSize={150} fontFamily={FONT} fontWeight={900} fill="#ff4a3a" opacity={sh} transform={`scale(${0.6 + 0.4 * sh})`} style={{transformOrigin: `${cx}px 280px`}}>
					✗
				</text>
				{shadow(cx)}
				<Actor who="hero" x={cx} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.4, 0.3]} expr={sh > 0.5 ? 'worried' : 'normal'} pose={p} bob={jmp * 14} uid={uid} />
				<Rope p={p} x={cx} s={HS} facing={1} a={(e + k * 7) / 4.6} c="#ffd34a" />
				<Tag x={cx} y={tagY(HS) + 80 - jmp * 14} value={counterAt(gf)} f={f} s={1.05} warn heart auto showBpm bpm={150} />
			</g>
		);
	};
	return (
		<Board tint="#1a2150">
			{panel(480, '1 РАУНД', 1, 0, 'h41a')}
			{panel(1440, '2 РАУНДА', 2, 1, 'h41b')}
			<line x1={960} y1={0} x2={960} y2={1080} stroke="#fff" strokeWidth={6} opacity={0.5} />
		</Board>
	);
};

/* 042 TEMA + 043 HERO: «меньше трёх не считается»; «Нобелевку пополам» — стукаются кулаками */
const S42: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('042');
	const scribble = Math.sin(e / 2) * 5;
	const glasses = env(f, at('042') + 52, at('042') + 92, 6, 8);
	const five = env(f, at('043') + 2, at('043') + 34, 5, 8);
	let tp = idle(gf, 4);
	tp = hand(tp, TX0, 1, -1, 'F', [TX0 - 52, FL - 157 - 60 + scribble * 0.3], 1 - glasses);
	tp = gesture('touchFace', tp, glasses, f);
	let hp = idle(gf, 1);
	let tq = tp;
	if (five > 0) {
		const r = handshake(hp, tq, five, f, {x: 780, y: hip(HS), s: HS, facing: 1}, {x: TX0 - 110, y: hip(1), s: 1, facing: -1});
		hp = r.a;
		tq = r.b;
	}
	const tx = TX0 - 110 * grow(e, 90, 10);
	const cam = usePush(camOn(930, 560, 1.3), camOn(940, 545, 1.5));
	return (
		<Stage cam={cam} bg={YSKY} light={{x: 70, y: 8, o: 0.4}}>
			<Layer depth={1.6}>
				<Yard f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={780} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.8, 0]} expr="normal" mouth={five > 0.4 ? 'smile' : undefined} pose={hp} handF={five > 0.5 ? 'fist' : undefined} uid="h42" />
					<HT x={790} s={0.95} auto bpm={80} />
					<Actor who="tema" x={tx} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.5, 0.4]} expr="normal" mouth={five > 0.4 ? 'smile' : undefined} pose={tq} handF={five > 0.5 ? 'fist' : undefined} uid="t42" />
					{five < 0.1 ? penEar(tx + 36, FL - 157 - 164 + 6) : null}
					{five < 0.1 && glasses < 0.2 ? notebook(tx - 70, FL - 157 - 52 + scribble * 0.3) : null}
					<HT x={tx} s={0.95} auto bpm={80} yy={tagY(1)} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 044: 23:50, оба прыгают на скакалке под фонарём */
const S44: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('044');
	const jh = Math.abs(Math.sin(e / 4.6));
	const jt = Math.abs(Math.sin((e + 3) / 4.3));
	const mk = (j: number, seed: number) => {
		let p = reach(reach(idle(gf, seed), 'F', [34, -20], 1), 'B', [22, -22], 1);
		return {...p, legF: [p.legF[0] + 6, 22 * j], legB: [p.legB[0] - 4, 22 * j]} as Pose;
	};
	const hp = mk(jh, 1);
	const tp = mk(jt, 4);
	const cam = usePush(camOn(1000, 540, 1.1), camOn(1230, 560, 1.38));
	return (
		<Stage cam={cam} bg="#0b1030" light={{x: 70, y: 8, o: 0.3, night: true}}>
			<Layer depth={1.6}>
				<Yard f={f} night />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<Clock x={500} y={330} text="23:50" s={1.4} blink f={f} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					{shadow(1180)}
					{shadow(1470)}
					<Actor who="hero" x={1180} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.4, 0.4]} expr="worried" mouth="open" pose={hp} bob={jh * 14} uid="h44" />
					<Rope p={hp} x={1180} s={HS} facing={1} a={e / 4.6} c="#ffd34a" />
					<HT x={1180} s={0.95} auto showBpm bpm={150} yy={tagY(HS) - jh * 14} />
					<Actor who="tema" x={1470} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.4, 0.4]} expr="worried" mouth="open" pose={tp} bob={jt * 14} uid="t44" />
					<Rope p={tp} x={1470} s={1} facing={-1} a={(e + 3) / 4.3} c="#e86aa0" />
					<HT x={1470} s={0.95} auto showBpm bpm={150} yy={tagY(1) - jt * 14} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 045: «3 РАУНДА ✓» — схема 3 + 1 + 3 + 1 + 3 (минуты) */
const S45: React.FC = () => {
	const {f, at} = useShot();
	const e = f - at('045');
	const U = 130; // px на минуту
	const segs: [number, string, string][] = [
		[3, '#e2483a', 'РАУНД'],
		[1, '#5a6280', 'ОТДЫХ'],
		[3, '#e2483a', 'РАУНД'],
		[1, '#5a6280', 'ОТДЫХ'],
		[3, '#e2483a', 'РАУНД'],
	];
	let x = 960 - (11 * U) / 2;
	return (
		<Board tint="#13301f">
			<text x={960} y={190} textAnchor="middle" fontSize={130} fontFamily={FONT} fontWeight={900} fill="#5fe08a" opacity={grow(e, 6, 12)}>
				3 РАУНДА ✓
			</text>
			{segs.map(([m, c, name], i) => {
				const x0 = x;
				x += m * U;
				const k = grow(e, 24 + i * 22, 14);
				return (
					<g key={i} opacity={k}>
						<rect x={x0 + 3} y={420} width={m * U * k - 6} height={150} rx={16} fill={c} stroke="#10132a" strokeWidth={5} />
						<text x={x0 + (m * U) / 2} y={520} textAnchor="middle" fontSize={m === 3 ? 76 : 60} fontFamily={FONT} fontWeight={900} fill="#fff">
							{m}
						</text>
						<text x={x0 + (m * U) / 2} y={636} textAnchor="middle" fontSize={m === 3 ? 34 : 28} fontFamily={FONT} fontWeight={700} fill="#c8d0ea">
							{m === 3 ? '3 МИН' : '1 МИН'}
						</text>
						<text x={x0 + (m * U) / 2} y={690} textAnchor="middle" fontSize={m === 3 ? 34 : 26} fontFamily={FONT} fontWeight={800} fill={c === '#e2483a' ? '#ff9a8a' : '#aab3d6'}>
							{name}
						</text>
					</g>
				);
			})}
			<text x={960} y={860} textAnchor="middle" fontSize={110} fontFamily={FONT} fontWeight={900} fill="#fff" opacity={grow(e, 140, 14)}>
				3 + 1 + 3 + 1 + 3
			</text>
		</Board>
	);
};

/* 046 TEMA + 047 N: Опыт второй — стойка посреди пустого двора; бой с тенью, сердце 150, «засчитано» */
const S46: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('046');
	const e47 = f - at('047');
	const tw = walkTo(e, 6, 40, 1250, 1000, 4, 0.28);
	const t0 = 14;
	let tp: Pose = guard(tw.pose, grow(e, 36, 10));
	let hp: Pose = guard(idle(gf, 1), grow(e, 70, 10));
	for (let i = 0; i < 8; i++) {
		const st = at('047') + 6 + i * 17;
		tp = hit(tp, i % 2 ? 'B' : 'F', tw.x, 1, -1, [tw.x - 150, 650 + (i % 3) * 18], env(f, st, st + 11, 3, 5));
		hp = hit(hp, i % 2 ? 'F' : 'B', 640, HS, 1, [790, 640 + (i % 3) * 18], env(f, st + 5, st + 16, 3, 5));
	}
	const bpm = interpolate(e47, [-20, 40], [110, 150], clamp);
	const ok = e47 > 92;
	const cam = usePush(camOn(830, 560, 1.2), camOn(850, 550, 1.55));
	return (
		<Stage cam={cam} bg={YSKY} light={{x: 70, y: 8, o: 0.4}}>
			<Layer depth={1.6}>
				<Yard f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={640} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0]} expr="angry" pose={hp} uid="h46" />
					<HT x={640} s={0.95} auto showBpm bpm={bpm} ok={ok} />
					<Actor who="tema" x={tw.x} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.8, 0]} expr="angry" pose={tp} vx={tw.vx} bob={tw.bob} uid="t46" />
					<HT x={tw.x} s={0.95} auto showBpm bpm={bpm} ok={ok} yy={tagY(1)} />
					{ok && e47 < 118 ? <circle cx={tw.x} cy={tagY(1)} r={50 + (e47 - 92) * 7} fill="none" stroke="#5fe08a" strokeWidth={8 * (1 - (e47 - 92) / 26)} opacity={Math.max(0, 1 - (e47 - 92) / 26)} /> : null}
					{ok ? <Onoma x={tw.x + 120} y={tagY(1) - 30} text="✓" t={e47 - 92} c="#5fe08a" rot={-8} size={100} /> : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 048 N + 049 TEMA: телефон вибрирует в кармане, Тёма замирает и отвечает: «Да, мам. Да. Он поел.» */
const S48: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('048');
	const e49 = f - at('049');
	const freeze = grow(e, 78, 6);
	const call = grow(e, 96, 10);
	let tp: Pose = guard(idle(gf, 4), 1 - freeze);
	for (let i = 0; i < 4; i++) {
		const st = 12 + i * 17;
		tp = hit(tp, i % 2 ? 'B' : 'F', TX0, 1, -1, [TX0 - 150, 650 + (i % 3) * 18], env(e, st, st + 11, 3, 5) * (1 - freeze));
	}
	tp = hand(tp, TX0, 1, -1, 'F', [TX0 - 30, FL - 157 - 150], call);
	const buzz = e > 70 && e < 100 ? Math.sin(e * 3.1) * 4 : 0;
	const bpm = interpolate(e, [0, 70, 100, 150, 210], [150, 150, 140, 118, 112], clamp);
	const cam = usePush(camOn(1080, 580, 1.35), camOn(1100, 560, 1.75));
	return (
		<Stage cam={cam} bg={YSKY} light={{x: 70, y: 8, o: 0.4}}>
			<Layer depth={1.6}>
				<Yard f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={760} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0]} expr="normal" pose={guard(idle(gf, 1), 0.8)} uid="h48" />
					<HT x={760} s={0.95} auto showBpm bpm={150} />
					<Actor who="tema" x={TX0 + buzz} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.6, 0.2]} expr={freeze > 0.5 ? 'wide' : 'angry'} mouth={e49 > 0 ? undefined : 'flat'} pose={tp} uid="t48" />
					<HT x={TX0 + buzz} s={0.95} auto showBpm bpm={bpm} yy={tagY(1)} />
					{freeze > 0.1 && call < 0.3 ? (
						<g transform={`translate(${TX0 - 38 + buzz},${FL - 90}) rotate(${Math.sin(e * 3) * 8})`}>
							<rect x={-14} y={-24} width={28} height={48} rx={6} fill="#10132a" stroke="#7fe0ff" strokeWidth={3} />
						</g>
					) : null}
					<Onoma x={TX0 - 120} y={FL - 140} text="БЗЗ" t={e - 74} c="#7fe0ff" rot={-10} size={52} />
					{pill(TX0 - 20, FL - 520, 'МАМА', '#7fe0ff', grow(e, 84, 8), 44)}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 050 N: «Тридцать секунд разговора… РАУНД 2 ✗», сердце жёлтое */
const S50: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('050');
	const tp = hand(idle(gf, 4), TX0, 1, -1, 'F', [TX0 - 30, FL - 157 - 150], 1);
	const secs = Math.min(30, Math.floor(e / 3));
	const out = grow(e, 70, 10);
	const bpm = interpolate(e, [0, 80], [115, 108], clamp);
	const cam = usePush(camOn(1080, 560, 1.4), camOn(1090, 540, 1.6));
	return (
		<Stage cam={cam} bg={YSKY} light={{x: 70, y: 8, o: 0.4}}>
			<Layer depth={1.6}>
				<Yard f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={760} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0]} expr="normal" pose={idle(gf, 1)} uid="h50" />
					<HT x={760} s={0.95} auto bpm={96} />
					<Actor who="tema" x={TX0} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.4, 0.2]} expr="worried" mouth="flat" pose={tp} uid="t50" />
					<HT x={TX0} s={1} auto showBpm bpm={bpm} yy={tagY(1) - 6} />
					{pill(TX0, FL - 520 - 80, `РАУНД 2  0:${String(secs).padStart(2, '0')}`, out > 0.5 ? '#ff6a5a' : '#7fe0ff', grow(e, 6, 10), 42)}
					{out > 0.02 ? <text x={TX0 + 250} y={FL - 520 - 60} fontSize={110 * out} fontFamily={FONT} fontWeight={900} fill="#ff4a3a" opacity={out}>✗</text> : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 051 N: «Остановился — начинай раунд заново»: вздыхает, снова стойка, таймер с нуля */
const S51: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('051');
	const sigh = env(e, 6, 40, 10, 12);
	const ready = grow(e, 42, 12);
	let tp: Pose = {...idle(gf, 4), lean: idle(gf, 4).lean + 12 * sigh, head: 14 * sigh};
	tp = guard(tp, ready);
	for (let i = 0; i < 3; i++) {
		const st = 62 + i * 17;
		tp = hit(tp, i % 2 ? 'B' : 'F', TX0, 1, -1, [TX0 - 150, 650 + (i % 3) * 18], env(e, st, st + 11, 3, 5));
	}
	const secs = Math.max(0, Math.floor((e - 54) / 12));
	const bpm = interpolate(e, [0, 54, 122], [112, 118, 150], clamp);
	const cam = usePush(camOn(1020, 560, 1.4), camOn(1000, 550, 1.2));
	return (
		<Stage cam={cam} bg={YSKY} light={{x: 70, y: 8, o: 0.4}}>
			<Layer depth={1.6}>
				<Yard f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={760} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0]} expr="normal" pose={guard(idle(gf, 1), 0.7)} uid="h51" />
					<HT x={760} s={0.95} auto bpm={96} />
					<Actor who="tema" x={TX0} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.7, 0]} expr={sigh > 0.4 ? 'sad' : 'angry'} mouth={sigh > 0.4 ? 'frown' : undefined} pose={tp} uid="t51" />
					<HT x={TX0} s={0.95} auto showBpm bpm={bpm} yy={tagY(1)} />
					{pill(TX0, FL - 600, `РАУНД 2  0:${String(Math.max(0, Math.min(59, secs))).padStart(2, '0')}`, '#7fe0ff', grow(e, 40, 10), 42)}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 052 + 053: школьный стадион — Тёма показывает на дорожку; «Давай просто побегаем» — трусцой */
const mkJog = (tail: string): React.FC => () => {
	const {f, gf, at} = useShot();
	const e = f - at(tail);
	const e52 = f - at('052');
	const point = env(f, at('052') + 6, at('052') + 55, 6, 8);
	const run = grow(f, at('053'), 14);
	const ph = Math.max(0, f - at('053')) / 3.4;
	const speed = 2.4;
	const xs = Math.max(0, f - at('053')) * speed;
	let hp: Pose = idle(gf, 1);
	let tp: Pose = gesture('point', idle(gf, 4), point, f);
	const wh = walk(ph);
	hp = blend(hp, {...wh, lean: 9, head: -2, armF: [wh.armF[0] * 0.8, wh.armF[1]], armB: [wh.armB[0] * 0.8, wh.armB[1]]}, run);
	tp = blend(tp, {...walk(ph + 0.6), lean: 9, head: -2}, run);
	const hx = 700 + xs;
	const tx = 980 + xs;
	const bob = run * Math.abs(Math.sin(ph)) * 10;
	const cam = run < 0.05 ? usePush(camOn(850, 560, 1.15), camOn(870, 555, 1.3)) : camOn((hx + tx) / 2 + 40, 560, 1.3);
	return (
		<Stage cam={cam} bg="#6aa0d8" light={{x: 70, y: 8, o: 0.4}}>
			<Layer depth={1.6}>
				<Stadium f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={hx} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.8, 0]} expr="normal" pose={hp} vx={run * speed} bob={bob} uid="h52" />
					<HT x={hx} s={0.95} auto showBpm={run > 0.5} bpm={interpolate(run, [0, 1], [84, 125])} yy={tagY(HS) - bob * HS} />
					<Actor who="tema" x={tx} floor={FL} s={1} facing={1} faceTurn={0.5} look={[0.3, 0]} expr="normal" pose={tp} vx={run * speed} bob={bob} uid="t52" handF={point > 0.5 ? 'point' : undefined} />
					<HT x={tx} s={0.95} auto showBpm={run > 0.5} bpm={interpolate(run, [0, 1], [84, 125])} yy={tagY(1) - bob} />
				</Svg>
			</Layer>
		</Stage>
	);
};
const S52 = mkJog('052');

/* 054: десять минут ровного бега — сердце жёлтое 125, «не засчитано» */
const S54: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('054');
	const ph = (f - at('052')) / 3.4;
	const xs = (f - at('053')) * 2.4;
	const wh = walk(ph);
	const hp: Pose = {...wh, lean: 9, head: -2};
	const tp: Pose = {...walk(ph + 0.6), lean: 9, head: -2};
	const bob = Math.abs(Math.sin(ph)) * 10;
	const hx = 700 + xs;
	const tx = 980 + xs;
	const mins = Math.min(10, Math.floor(e / 14));
	const bad = grow(e, 120, 10);
	const glance = grow(e, 130, 10);
	const cam = camOn((hx + tx) / 2 + 40, 560, 1.3);
	return (
		<Stage cam={cam} bg="#6aa0d8" light={{x: 70, y: 8, o: 0.4}}>
			<Layer depth={1.6}>
				<Stadium f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={hx} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.9 - glance * 1.4, 0]} expr={glance > 0.5 ? 'worried' : 'normal'} pose={hp} vx={2.4} bob={bob} uid="h54" />
					<HT x={hx} s={1} auto showBpm bpm={125} yy={tagY(HS) - bob * HS} />
					<Actor who="tema" x={tx} floor={FL} s={1} facing={1} faceTurn={0.5} look={[0.3 - glance * 1.4, 0]} expr={glance > 0.5 ? 'worried' : 'normal'} pose={tp} vx={2.4} bob={bob} uid="t54" />
					<HT x={tx} s={1} auto showBpm bpm={125} yy={tagY(1) - bob} />
					{pill((hx + tx) / 2 + 40, 230, `БЕГ ${mins}:00`, '#c8d0ea', grow(e, 6, 10), 44)}
					{bad > 0.02 ? <text x={(hx + tx) / 2 + 40} y={410} textAnchor="middle" fontSize={170 * bad} fontFamily={FONT} fontWeight={900} fill="#ff4a3a" opacity={bad}>✗</text> : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 055 TEMA + 056 HERO: «То есть бегать бесполезно?» — руки на поясе; «Для счётчика — да. Для ног — нет.» */
const S55: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('055');
	const sh = env(f, at('056') + 2, at('056') + 26, 5, 8);
	const slap = env(f, at('056') + 30, at('056') + 52, 4, 8);
	const hx = 700 + 3000 * 0 + 1000;
	let hp = gesture('shrug', idle(gf, 1), sh, f);
	hp = hand(hp, hx, HS, 1, 'B', [hx - 6, hip(HS) + 36], slap);
	let tp = idle(gf, 4);
	tp = hand(hand(tp, hx + 280, 1, 1, 'F', [hx + 300, hip(1) - 4], 1), hx + 280, 1, 1, 'B', [hx + 262, hip(1) - 6], 1);
	const cam = usePush(camOn(hx + 160, 560, 1.4), camOn(hx + 160, 545, 1.65));
	return (
		<Stage cam={cam} bg="#6aa0d8" light={{x: 70, y: 8, o: 0.4}}>
			<Layer depth={1.6}>
				<Stadium f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={hx} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.8, 0]} expr="normal" mouth={sh > 0.3 ? 'smirk' : undefined} pose={hp} uid="h55" />
					<HT x={hx} s={0.95} auto bpm={104} />
					<Actor who="tema" x={hx + 280} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.8, 0]} expr="worried" pose={tp} uid="t55" />
					<HT x={hx + 280} s={0.95} auto bpm={104} yy={tagY(1)} />
					<Onoma x={hx + 20} y={hip(HS) + 30} text="ХЛОП" t={f - (at('056') + 40)} c="#ffd34a" rot={-8} size={48} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 057: мелом «ПРАВИЛО 2» — слова пишутся по одному */
const S57: React.FC = () => {
	const {f, at} = useShot();
	const e = f - at('057');
	const L = [
		{t: 'ПРАВИЛО 2:', y: 190, at: 0, size: 110, c: '#f4f1e6'},
		{t: 'ТРИ РАУНДА', y: 350, at: 34, size: 120, c: '#ffd34a'},
		{t: 'БЕЗ ОСТАНОВКИ', y: 500, at: 62, size: 120, c: '#ffd34a'},
		{t: 'МЕСТО НЕ ВАЖНО', y: 650, at: 92, size: 120, c: '#f4f1e6'},
		{t: 'РОВНЫЙ БЕГ — НЕ В СЧЁТ', y: 800, at: 118, size: 100, c: '#ff8a7a'},
	];
	return (
		<Board tint="#1d3a33">
			{L.map((l, i) => (
				<Chalk key={i} x={960} y={l.y} text={l.t} k={grow(e, l.at, 24)} size={l.size} c={l.c} anchor="middle" />
			))}
		</Board>
	);
};

/* 058: 19:30 — Тёма убегает и перепрыгивает через забор, рюкзак подпрыгивает */
const S58: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('058');
	const run = walkTo(e, 40, 96, 960, 1900, 5, 0.9);
	const jt = grow(e, 96, 22);
	const over = e >= 96;
	const jx = over ? 1900 + 170 * jt : run.x;
	const jy = over ? Math.sin(jt * Math.PI) * 170 : 0;
	const fl = FL - (over && jt > 0.9 ? 0 : 0);
	const tp: Pose = over ? {...walk(e / 2), lean: 12, legF: [60, 40], legB: [-30, 60]} : run.pose;
	const hp = idle(gf, 1);
	const tx = over ? jx : run.x;
	const cam = camOn(Math.max(1000, tx - 140 + (over ? 100 : 0)), 570, 1.2 + 0.1 * jt);
	return (
		<Stage cam={cam} bg={YSKY} light={{x: 70, y: 8, o: 0.4}}>
			<Layer depth={1.6}>
				<Yard f={f} />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<Clock x={500} y={330} text="19:30" s={1.4} f={f} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={780} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.9, 0]} expr="wide" pose={hp} uid="h58" />
					<HT x={780} s={0.95} auto bpm={78} />
					<Actor who="tema" x={tx} floor={fl} s={1} facing={1} faceTurn={0.5} look={[0.9, 0]} expr="worried" pose={tp} vx={run.vx} bob={over ? jy : run.bob} uid="t58" shadow={!over} />
					<g transform={`translate(${tx - 52},${hip(1) - 130 - (over ? jy : run.bob) - Math.sin(e / 2.6) * 4})`}>
						<rect width={44} height={82} rx={12} fill="#3a4256" stroke="#10132a" strokeWidth={3} />
					</g>
					<HT x={tx} s={0.95} auto bpm={over ? 140 : 120} yy={tagY(1) - (over ? jy : run.bob)} />
					{/* передний ряд плит: Тёма за забором виден по плечи */}
					<g>
						<rect x={1940} y={690} width={620} height={230} fill="#a3a3a3" stroke="#6a6a6a" strokeWidth={4} opacity={over && jt > 0.5 ? 1 : 0} />
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 059: над убегающим Тёмой большой вопросительный знак */
const S59: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('059');
	const t = grow(e, 0, 70);
	const tx = 2060 + 380 * t;
	const s = 0.95 - 0.3 * t;
	const fl = 900 - 50 * t;
	const q = grow(e, 10, 10);
	const cam = camOn(1780 + 160 * t, 580, 1.15);
	return (
		<Stage cam={cam} bg={YSKY} light={{x: 70, y: 8, o: 0.4}}>
			<Layer depth={1.6}>
				<Yard f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={1760} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.9, 0]} expr="wide" pose={idle(gf, 1)} uid="h59" />
					<HT x={1760} s={0.95} auto bpm={78} />
					<Actor who="tema" x={tx} floor={fl} s={s} facing={1} faceTurn={0.5} look={[0.9, 0]} expr="worried" pose={{...walk(e / 2.4), lean: 10}} vx={4} bob={Math.abs(Math.sin(e / 2.4)) * 8} uid="t59" />
					<text x={tx} y={fl - 157 * s - 164 * s - 90} textAnchor="middle" fontSize={260 * q * (0.6 + 0.4 * s)} fontFamily={FONT} fontWeight={900} fill="#ffd34a" stroke="#10132a" strokeWidth={14} paintOrder="stroke" transform={`rotate(${Math.sin(e / 6) * 6} ${tx} ${fl - 400})`}>
						?
					</text>
				</Svg>
			</Layer>
		</Stage>
	);
};

export const PART23: ShotDef[] = [
	{at: '026', C: S26, whip: true},
	{at: '027', C: S27, own: true, ownCuts: []},
	{at: '028', C: S28, whip: true},
	{at: '029', C: S29, own: true, ownCuts: []},
	{at: '030', C: S30},
	{at: '031', C: S31},
	{at: '032', C: S32},
	{at: '033', C: S33, own: true, ownCuts: []},
	{at: '034', C: S34, whip: true},
	{at: '035', C: S35},
	{at: '036', C: S36},
	{at: '037', C: S37},
	{at: '038', C: S38, own: true, ownCuts: []},
	{at: '039', C: S39, whip: true},
	{at: '040', C: S40},
	{at: '041', C: S41, own: true, ownCuts: []},
	{at: '042', C: S42, whip: true},
	{at: '044', C: S44, whip: true},
	{at: '045', C: S45, own: true, ownCuts: []},
	{at: '046', C: S46, whip: true},
	{at: '048', C: S48},
	{at: '050', C: S50},
	{at: '051', C: S51},
	{at: '052', C: S52, whip: true},
	{at: '054', C: S54},
	{at: '055', C: S55},
	{at: '057', C: S57, own: true, ownCuts: []},
	{at: '058', C: S58, whip: true},
	{at: '059', C: S59},
];
