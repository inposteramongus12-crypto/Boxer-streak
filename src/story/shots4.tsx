import React from 'react';
import {interpolate} from 'remotion';
import {Pose, rigPoints, toLocal} from '../engine/Stickman';
import {blend, env, gesture, idle, reach, walk, walkTo} from '../kit/actions';
import {Actor, counterAt, useShot, useSpeaking} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Layer, Stage, Svg, camOn, clamp, ease, usePush} from '../kit/kit';
import {Bubble, Board, FONT} from '../kit/ui';
import {Onoma} from '../reference/PauseTime';
import {BoxStreet, Clock, Facade, Room, Tag} from './places';
import {FL, HS, HT, grow, hip, tagY} from './common';
import {FS, hand, pill, shadow} from './shots2';

/* Часть 6 (реплики 077–093): тайна Тёмы. Табличка героя и Тёмы — 15 (по календарю в PROGRESS.md). */
const EVE = '#3b4a78';
const Pads2: React.FC<{a: [number, number]; b: [number, number]}> = ({a, b}) => (
	<g>
		{[a, b].map((p, i) => <rect key={i} x={p[0] - 15} y={p[1] - 27} width={36} height={54} rx={11} fill="#e2483a" stroke="#7a1812" strokeWidth={4} transform={`rotate(-8 ${p[0]} ${p[1]})`} />)}
	</g>
);
const Kiosk: React.FC<{x: number}> = ({x}) => (
	<g>
		<rect x={x} y={610} width={300} height={290} fill="#3aa37a" stroke="#10132a" strokeWidth={5} />
		<rect x={x - 14} y={580} width={328} height={44} rx={8} fill="#e2483a" stroke="#10132a" strokeWidth={5} />
		<rect x={x + 40} y={670} width={150} height={100} fill="#cfe6f5" stroke="#10132a" strokeWidth={5} />
		<rect x={x + 210} y={680} width={60} height={120} fill="#2a2018" />
	</g>
);
const flip = (p: Pose, k: number): Pose => ({...p, lean: p.lean + 25 * k, head: p.head + 12 * k});

/* 077: день 18, 19:30 — Тёма убегает, герой крадётся следом и прячется за киоском */
const S77: React.FC = () => {
	const {f, at} = useShot();
	const e = f - at('077');
	const tw = walkTo(e, 16, 90, 140, 1760, 1, 0.8);
	const hw = walkTo(e, 40, 104, 40, 1190, 3, 0.42);
	const hide = grow(e, 104, 10);
	const hp = flip(hw.pose, 1);
	const cam = camOn(Math.max(450, Math.min(1250, (tw.x + hw.x) / 2)), 570, 1.15 + 0.1 * hide);
	return (
		<Stage cam={cam} bg={EVE} light={{x: 70, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<BoxStreet f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="tema" x={tw.x} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.9, 0]} expr="worried" pose={tw.pose} vx={tw.vx} bob={tw.bob} uid="t77" />
					<HT x={tw.x} s={1} auto bpm={96} yy={tagY(1) - tw.bob} />
					<Actor who="hero" x={hw.x} floor={FL} s={HS} facing={1} faceTurn={0.3} look={[0.9, 0.1]} expr="normal" pose={hp} vx={hw.vx} bob={hw.bob * 0.5} uid="h77" />
					<HT x={hw.x} s={1} auto bpm={92} yy={tagY(HS) - 6} />
					<Kiosk x={1030} />
				</Svg>
			</Layer>
			<div style={{position: 'absolute', left: 48, top: 40, background: '#10141f', border: '5px solid #2c3646', borderRadius: 18, padding: '4px 26px', color: '#ff4a3a', fontFamily: FONT, fontWeight: 800, fontSize: 80, textShadow: '0 0 12px #ff4a3a'}}>19:30</div>
		</Stage>
	);
};

/* 078: у подъезда ждёт мама Тёмы в медицинской форме, смотрит на часы; герой прячется за кустом */
const S78: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('078');
	const tw = walkTo(e, 0, 50, -150, 540, 2, 0.8);
	const look = env(e, 56, 110, 8, 8);
	let mp = idle(gf, 5);
	mp = hand(mp, 800, 1, -1, 'F', [800 - 40, hip(1) - 80], look);
	const cam = usePush(camOn(800, 560, 1.2), camOn(1100, 560, 1.2));
	return (
		<Stage cam={cam} bg={EVE} light={{x: 60, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Facade f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="tmom" x={800} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.6, look * 0.8]} expr="normal" pose={mp} uid="m78" />
					<rect x={840} y={FL - 60} width={50} height={44} rx={8} fill="#3a4256" stroke="#10132a" strokeWidth={3} />
					<Actor who="tema" x={tw.x} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.9, 0]} expr="worried" pose={tw.pose} vx={tw.vx} bob={tw.bob} uid="t78" />
					<HT x={tw.x} s={1} auto bpm={96} yy={tagY(1) - tw.bob} />
					<Actor who="hero" x={1800} floor={FL} s={HS} facing={-1} faceTurn={0.3} look={[-0.9, 0]} expr="normal" pose={flip(idle(gf, 1), 1)} uid="h78" />
					<ellipse cx={1850} cy={850} rx={150} ry={86} fill="#2f6f46" />
					<ellipse cx={1780} cy={820} rx={90} ry={64} fill="#3a8656" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 079a: мама целует брата в макушку и уходит */
const S79a: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('079');
	const kiss = env(e, 8, 62, 12, 12);
	const away = walkTo(e, 70, 130, 780, 1500, 5, 0.3);
	let mp = idle(gf, 5);
	mp = {...mp, lean: mp.lean + 36 * kiss, head: mp.head + 12 * kiss};
	const mx = e < 70 ? 780 : away.x;
	const cam = usePush(camOn(700, 580, 1.4), camOn(900, 570, 1.25));
	return (
		<Stage cam={cam} bg={EVE} light={{x: 60, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Facade f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="tema" x={500} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.9, 0.2]} expr="normal" pose={idle(gf, 4)} uid="t79" />
					<Actor who="bro" x={650} floor={FL} s={0.6} facing={1} faceTurn={0.4} look={[0.4, -0.4]} expr="normal" mouth={kiss > 0.4 ? 'smile' : undefined} pose={idle(gf, 7)} uid="b79" />
					<Actor who="tmom" x={mx} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.6, 0.6]} expr="normal" mouth={kiss > 0.4 ? 'smile' : undefined} pose={e < 70 ? mp : away.pose} vx={e < 70 ? 0 : away.vx} bob={e < 70 ? 0 : away.bob} uid="m79" />
					<Onoma x={700} y={FL - 330} text="МУА" t={e - 36} c="#ffb0c8" rot={-8} size={50} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 079b: брат в окне машет */
const S79b: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('079');
	const wave = grow(e, 90, 8);
	const p = gesture('wave', idle(gf, 7), wave, f);
	const cam = usePush(camOn(1615, 400, 1.7), camOn(1615, 390, 2.0));
	return (
		<Stage cam={cam} bg={EVE} light={{x: 60, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Facade f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="bro" x={1615} floor={560} s={0.65} facing={-1} faceTurn={0.3} look={[-0.7, 0.3]} expr="normal" mouth="smile" pose={p} shadow={false} uid="b79b" />
					<rect x={1480} y={462} width={270} height={170} fill="#8c5a48" />
					<rect x={1470} y={470} width={290} height={16} rx={4} fill="#6a6a72" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 080 TEMA + 081 HERO: «Ты чего здесь? Следил, что ли?» — «Почему ты не сказал?» */
const S80: React.FC = () => {
	const {f, gf, at} = useShot();
	const sp = useSpeaking(gf);
	const e = f - at('080');
	const hw = walkTo(e, 0, 40, 1800, 1150, 3, 0.3);
	const spread = env(f, at('081') + 4, at('081') + 28, 5, 8);
	let hp = hw.pose;
	hp = gesture('presentF', hp, spread, gf);
	const cam = sp === 'HERO' ? camOn(1000, 545, 1.5) : sp === 'TEMA' ? camOn(780, 545, 1.5) : camOn(850, 560, 1.15);
	return (
		<Stage cam={cam} bg={EVE} light={{x: 60, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Facade f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="tema" x={600} floor={FL} s={1} facing={1} faceTurn={0.5} look={[0.8, 0]} expr="angry" pose={idle(gf, 4)} uid="t80" />
					<HT x={600} s={1} auto bpm={88} yy={tagY(1)} />
					<Actor who="hero" x={hw.x} floor={FL} s={HS} facing={-1} faceTurn={0.5} look={[-0.8, 0]} expr="normal" pose={hp} vx={hw.vx} bob={hw.bob} uid="h80" />
					<HT x={hw.x} s={1} auto bpm={96} yy={tagY(HS) - hw.bob} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 082 TEMA, 083 HERO, 084 TEMA: «Это не лень», «Я думал, ты сачкуешь», «Пусть думают» */
const S82: React.FC = () => {
	const {f, gf, at} = useShot();
	const sp = useSpeaking(gf);
	const shrug = env(f, at('082') + 28, at('082') + 62, 6, 8);
	const lookW = env(f, at('082') + 62, at('082') + 100, 8, 10);
	const scratch = env(f, at('083') + 6, at('083') + 46, 6, 8);
	const smile = grow(f, at('084') + 8, 10);
	const tp = gesture('shrug', idle(gf, 4), shrug, gf);
	const hp = gesture('scratch', idle(gf, 1), scratch, gf);
	const cam = sp === 'HERO' ? camOn(1000, 545, 1.5) : sp === 'TEMA' ? camOn(780, 545, 1.5) : camOn(900, 560, 1.15);
	return (
		<Stage cam={cam} bg={EVE} light={{x: 60, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Facade f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="tema" x={600} floor={FL} s={1} facing={1} faceTurn={0.5} look={[0.8 + lookW * 0.3, -lookW * 0.8]} expr="normal" mouth={smile > 0.5 ? 'smirk' : undefined} pose={tp} uid="t82" />
					<HT x={600} s={1} auto bpm={88} yy={tagY(1)} />
					<Actor who="hero" x={1150} floor={FL} s={HS} facing={-1} faceTurn={0.5} look={[-0.8, scratch * 0.4]} expr={scratch > 0.4 ? 'worried' : 'normal'} pose={hp} uid="h82" />
					<HT x={1150} s={1} auto bpm={96} yy={tagY(HS)} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 085: сплит — мама в больничном коридоре / Тёма закрывает дверь изнутри, брат держит его за руку */
const S85: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('085');
	const mw = walkTo(e, 10, 190, 120, 800, 5, 0.18);
	const door = grow(e, 100, 40);
	const close = 1 - door * 0.85;
	return (
		<Board tint="#13213a">
			<rect x={0} y={0} width={960} height={1080} fill="#d6ecee" />
			<rect x={0} y={640} width={960} height={440} fill="#9fb8bd" />
			{[0, 1, 2].map((i) => <rect key={i} x={100 + i * 300} y={300} width={140} height={340} fill="#7aa3aa" stroke="#4b6a70" strokeWidth={5} />)}
			<rect x={0} y={236} width={960} height={14} fill="#e2483a" opacity={0.8} />
			<rect x={960} y={0} width={960} height={1080} fill="#e9d8bd" />
			<rect x={960} y={640} width={960} height={440} fill="#b98a5c" />
			<rect x={1160} y={200} width={420} height={560} rx={8} fill="#ffd9a0" opacity={0.35} />
			<g transform={`translate(1160,200) scale(${close},1)`}>
				<rect width={420} height={560} rx={8} fill="#8a5535" stroke="#4a2a18" strokeWidth={6} />
				<circle cx={380} cy={300} r={14} fill="#d9c27a" />
			</g>
			<Actor who="tmom" x={mw.x} floor={900} s={1.05} facing={1} faceTurn={0.4} look={[0.8, 0]} expr="normal" pose={mw.pose} vx={mw.vx} bob={mw.bob} uid="m85" />
			<Actor who="tema" x={1380} floor={900} s={1} facing={1} faceTurn={0.4} look={[0.9, 0.1]} expr="normal" pose={reach(idle(gf, 4), 'B', toLocal(1450, 780, 1380, hip(1), 1, 1), 1)} uid="t85" />
			<Actor who="bro" x={1480} floor={900} s={0.6} facing={1} faceTurn={0.4} look={[0.4, -0.3]} expr="normal" pose={reach(idle(gf, 7), 'F', toLocal(1440, 780, 1480, hip(0.6), 0.6, 1), 1)} uid="b85" />
			<line x1={960} y1={0} x2={960} y2={1080} stroke="#fff" strokeWidth={8} />
			<Clock x={960} y={110} text="20:00" s={0.8} f={f} />
		</Board>
	);
};

/* 086 TEMA + 087 HERO: «Зал до девяти. А мне в полвосьмого уже бежать.» — «Тогда давай тут. Я подержу лапы.» */
const S86: React.FC = () => {
	const {f, gf, at} = useShot();
	const sp = useSpeaking(gf);
	const pt1 = env(f, at('086') + 6, at('086') + 44, 6, 8);
	const pt2 = env(f, at('086') + 50, at('086') + 92, 6, 8);
	let tp = gesture('point', idle(gf, 4), pt1, gf);
	tp = hand(tp, 600, 1, 1, 'F', [900, 340], pt1 * 0.0);
	tp = gesture('point', tp, pt2, gf);
	const pads = grow(f, at('087') + 10, 10);
	let hp = idle(gf, 1);
	hp = hand(hand(hp, 1150, HS, -1, 'F', [1130 - 30, hip(HS) - 130], pads), 1150, HS, -1, 'B', [1130 - 40, hip(HS) - 110], pads);
	const cam = sp === 'HERO' ? camOn(1150, 540, 1.5) : camOn(900, 520, 1.2);
	return (
		<Stage cam={cam} bg={EVE} light={{x: 60, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Facade f={f} />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<Clock x={840} y={310} text="19:30" s={1} f={f} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="tema" x={600} floor={FL} s={1} facing={1} faceTurn={0.5} look={[0.8, pt2 > 0.3 ? -0.5 : -0.1]} expr="normal" pose={tp} handF={pt1 + pt2 > 0.5 ? 'point' : undefined} uid="t86" />
					<HT x={600} s={1} auto bpm={88} yy={tagY(1)} />
					<Actor who="hero" x={1150} floor={FL} s={HS} facing={-1} faceTurn={0.5} look={[-0.8, 0]} expr="normal" pose={hp} uid="h86" />
					<rect x={1160} y={hip(HS) - 190} width={44} height={86} rx={12} fill="#3a4256" stroke="#10132a" strokeWidth={3} />
					<HT x={1150} s={1} auto bpm={96} yy={tagY(HS)} />
					{pads > 0.02 ? <Pads2 a={[1060, 640]} b={[1070, 700]} /> : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 088 + 089: три раунда под окном; брат сверху считает вслух, на 29 сбивается и начинает заново */
const mkCount = (first: string): React.FC => () => {
	const {f, gf, at} = useShot();
	const e = f - at(first);
	const e88 = f - at('088');
	const punches = Math.max(0, Math.floor((e88 - 8) / 13));
	let tp: Pose = idle(gf, 4);
	const padsA: [number, number] = [1200, 620];
	const padsB: [number, number] = [1210, 690];
	const tx = 900;
	tp = {...tp, lean: 4};
	for (let i = 0; i < 40; i++) {
		const st = 8 + i * 13;
		const side = i % 2 ? 'B' : 'F';
		tp = reach(tp, side, toLocal(1190, 640 + (i % 3) * 18, tx, hip(1), 1, 1), env(e88, st, st + 8, 2, 4) * (e88 < 150 || e88 > 190 ? 1 : 0.0));
	}
	let hp = idle(gf, 1);
	hp = reach(reach(hp, 'F', toLocal(padsA[0], padsA[1], 1300, hip(HS), HS, -1), 1), 'B', toLocal(padsB[0], padsB[1], 1300, hip(HS), HS, -1), 1);
	let text = `${22 + Math.min(punches, 7)}!`;
	if (first === '089') {
		const t = e;
		text = t < 14 ? '27!' : t < 30 ? '28!' : t < 52 ? '29…' : t < 74 ? '1!' : '2!';
	}
	const laugh = first === '089' ? grow(e, 60, 10) : 0;
	const cam = usePush(camOn(1220, 470, 1.05), camOn(1230, 450, 1.28));
	return (
		<Stage cam={cam} bg={EVE} light={{x: 60, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Facade f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="bro" x={1615} floor={560} s={0.65} facing={-1} faceTurn={0.3} look={[-0.6, 0.5]} expr={laugh > 0.5 ? 'wide' : 'normal'} mouth="open" pose={gesture('wave', idle(gf, 7), env(e, 0, 999, 6, 6) * 0.0, f)} shadow={false} uid={'b88' + first} />
					<rect x={1480} y={462} width={270} height={170} fill="#8c5a48" />
					<rect x={1470} y={470} width={290} height={16} rx={4} fill="#6a6a72" />
					<Bubble x={1420} y={190} w={250} h={110} t={Math.max(0, e)} tail={[150, 150]}>
						<text x={0} y={22} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#10132a">
							{text}
						</text>
					</Bubble>
					<Actor who="tema" x={tx} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.8, 0]} expr={laugh > 0.5 ? 'normal' : 'angry'} mouth={laugh > 0.5 ? 'smile' : undefined} pose={guard2(tp)} uid={'t88' + first} />
					<HT x={tx} s={1} auto showBpm bpm={150} yy={tagY(1)} />
					<Actor who="hero" x={1300} floor={FL} s={HS} facing={-1} faceTurn={0.4} look={[-0.8, 0]} expr="normal" pose={hp} uid={'h88' + first} />
					<Pads2 a={padsA} b={padsB} />
					<HT x={1300} s={1} auto showBpm bpm={120} yy={tagY(HS)} />
					{laugh > 0.1 ? <Onoma x={tx - 170} y={600} text="ХА-ХА" t={e - 64} c="#ffd34a" rot={-6} size={52} /> : null}
				</Svg>
			</Layer>
		</Stage>
	);
};
const guard2 = (p: Pose) => p;
const S88 = mkCount('088');
const S89 = mkCount('089');

/* 090a/090b: шнурок — узел крупно и долго; Тёма сидит, таймер раунда набегает до 0:55 */
const KnotTimer: React.FC<{e: number}> = ({e}) => {
	const sec = Math.min(55, 5 + Math.floor(e / 4.4));
	return (
		<div style={{position: 'absolute', left: 48, top: 40, background: '#11142c', border: '5px solid #7fe0ff', borderRadius: 40, padding: '8px 28px', color: '#7fe0ff', fontFamily: FONT, fontWeight: 900, fontSize: 46}}>
			РАУНД 2 · 0:{String(sec).padStart(2, '0')} <span style={{fontSize: 28, color: '#c8d0ea'}}>×8</span>
		</div>
	);
};
export const Knot: React.FC<{x: number; y: number; s: number; e: number; teeth?: number}> = ({x, y, s, e, teeth = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<circle r={190} fill="#1a2150" stroke="#7fe0ff" strokeWidth={8} />
		{/* туго затянутый узел из петель */}
		<g stroke="#f4f1e6" strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round">
			<path d="M-130,70 C-60,-120 80,-120 20,0 C-30,90 -100,0 -20,-40 C60,-80 120,40 60,70" />
			<path d="M130,90 C60,-30 20,40 -40,20" />
			<path d="M-120,-30 C-60,60 40,60 100,-60" />
		</g>
		<g stroke="#10132a" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.55}>
			<path d="M-130,70 C-60,-120 80,-120 20,0 C-30,90 -100,0 -20,-40 C60,-80 120,40 60,70" />
		</g>
		{/* пальцы возятся */}
		<g transform={`translate(${Math.sin(e / 3) * 14},${Math.cos(e / 2.4) * 10})`}>
			<rect x={-30} y={-20} width={150} height={36} rx={18} fill="#f2c9a0" stroke="#10132a" strokeWidth={5} transform="rotate(-20)" />
			<rect x={-140} y={40} width={150} height={36} rx={18} fill="#f2c9a0" stroke="#10132a" strokeWidth={5} transform="rotate(25)" />
		</g>
	</g>
);
const mkKnot = (variant: 'a' | 'b'): React.FC => () => {
	const {f, gf, at} = useShot();
	const e = f - at('090');
	const tx = 900;
	const seat = FL - 79;
	const down = variant === 'a' ? 0.5 : 1;
	let tp: Pose = {...FS, lean: 18 + 30 * down, head: 8 * down, legB: [80, 80], legF: [84, 84]};
	tp = reach(reach(tp, 'F', [76, 74], 1), 'B', [70, 70], 1);
	const hd = rigPoints(tp).head;
	const hx = tx + hd[0];
	const hy = seat + hd[1];
	const cam = variant === 'a' ? usePush(camOn(1070, 700, 1.85), camOn(1080, 710, 2.1)) : usePush(camOn(1180, 570, 1.12), camOn(1190, 575, 1.22));
	const hxw = 1480 + Math.sin(e / 7) * 50;
	const bobw = Math.abs(Math.sin(e / 3.5)) * 10;
	const paw: [number, number] = [hxw - 100, 620 + Math.sin(e / 5) * 16];
	const pbw: [number, number] = [hxw - 108, 690 + Math.cos(e / 5) * 16];
	const hpw = reach(reach(idle(gf, 1), 'F', toLocal(paw[0], paw[1], hxw, hip(HS), HS, -1), 1), 'B', toLocal(pbw[0], pbw[1], hxw, hip(HS), HS, -1), 1);
	return (
		<Stage cam={cam} bg={EVE} light={{x: 60, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Facade f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					{shadow(tx, 1.4)}
					<Actor who="tema" x={tx} floor={FL} seat={seat} s={1} facing={1} faceTurn={0.3} look={[0.5, 0.9]} expr="worried" mouth={variant === 'b' ? 'open' : 'flat'} pose={tp} uid={'t90' + variant} />
					{variant === 'b' ? <path d={`M${tx + 110},${seat + 76} C${tx + 90},${seat + 20} ${hx + 36},${hy + 40} ${hx + 36},${hy + 28}`} stroke="#f4f1e6" strokeWidth={7} fill="none" /> : null}
					<Tag x={hx - 10} y={hy - 130} value={18} f={f} s={1.3} heart auto showBpm bpm={150} />
					{variant === 'b' ? (
						<g>
							<Actor who="hero" x={hxw} floor={FL} s={HS} facing={-1} faceTurn={0.4} look={[-0.8, 0.2]} expr="angry" pose={hpw} bob={bobw} uid="h90b" />
							<Pads2 a={paw} b={pbw} />
							<HT x={hxw} s={1.05} auto showBpm bpm={150} yy={tagY(HS) - bobw} />
						</g>
					) : null}
					{variant === 'a' ? <Knot x={1385} y={720} s={0.8} e={e} /> : <Knot x={640} y={340} s={0.5} e={e} />}
				</Svg>
			</Layer>
			<KnotTimer e={e + (variant === 'b' ? 110 : 0)} />
		</Stage>
	);
};
const S90a = mkKnot('a');
const S90b = mkKnot('b');

/* 091: герой пританцовывает над Тёмой, лапы в стойке; у сидящего Тёмы сердце остаётся красным */
const S91: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('091');
	const hx = 1560 + Math.sin(e / 7) * 50;
	const bob = Math.abs(Math.sin(e / 3.5)) * 10;
	let hp = idle(gf, 1);
	const pa: [number, number] = [hx - 100, 620 + Math.sin(e / 5) * 16];
	const pb: [number, number] = [hx - 108, 690 + Math.cos(e / 5) * 16];
	hp = reach(reach(hp, 'F', toLocal(pa[0], pa[1], hx, hip(HS), HS, -1), 1), 'B', toLocal(pb[0], pb[1], hx, hip(HS), HS, -1), 1);
	const tx = 900;
	const seat = FL - 79;
	let tp: Pose = {...FS, lean: 36, head: 8, legB: [80, 80], legF: [84, 84]};
	tp = reach(reach(tp, 'F', [76, 74], 1), 'B', [70, 70], 1);
	const hd = rigPoints(tp).head;
	const cam = usePush(camOn(1230, 560, 1.15), camOn(1240, 580, 1.3));
	return (
		<Stage cam={cam} bg={EVE} light={{x: 60, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Facade f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					{shadow(tx, 1.4)}
					<Actor who="tema" x={tx} floor={FL} seat={seat} s={1} facing={1} faceTurn={0.3} look={[0.5, 0.9]} expr="worried" mouth="flat" pose={tp} uid="t91" />
					<Tag x={tx + hd[0] - 10} y={seat + hd[1] - 130} value={18} f={f} s={1.3} heart auto showBpm bpm={150} />
					<Actor who="hero" x={hx} floor={FL} s={HS} facing={-1} faceTurn={0.4} look={[-0.8, 0.2]} expr="angry" pose={hp} bob={bob} uid="h91" />
					<Pads2 a={pa} b={pb} />
					<HT x={hx} s={1.05} auto showBpm bpm={150} yy={tagY(HS) - bob} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 092: полночь, герой у зеркала — табличка зелёная, хотя сам он ни разу не ударил */
const S92: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('092');
	const ok = grow(e, 24, 6);
	const cam = usePush(camOn(1200, 540, 1.1), camOn(1240, 520, 1.35));
	return (
		<Stage cam={cam} bg="#262b48" light={{x: 20, y: 8, o: 0.3}}>
			<Layer depth={1.6}>
				<Room f={f} night />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<Clock x={1000} y={170} text="00:00" s={1.2} f={f} />
					<rect x={880} y={260} width={420} height={600} rx={14} fill="#a9c8e0" stroke="#d9c27a" strokeWidth={14} />
					<polygon points="920,260 1010,260 900,860 880,860" fill="#fff" opacity={0.18} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<g opacity={0.8}>
						<Actor who="hero" x={1090} floor={FL - 40} s={0.9} facing={1} faceTurn={0.3} look={[0.6, 0]} expr="normal" pose={idle(gf, 3)} shadow={false} uid="h92r" />
					</g>
					<Actor who="hero" x={1520} floor={FL} s={HS} facing={-1} faceTurn={0.5} look={[-0.9, 0]} expr="normal" pose={idle(gf, 1)} uid="h92" />
					<HT x={1530} s={1.15} ok={ok > 0.5} auto showBpm bpm={88} yy={tagY(HS) - 6} pop={1 + 0.25 * Math.exp(-Math.max(0, e - 24) / 5) * ok} />
					{ok > 0.5 && e < 46 ? <circle cx={1530} cy={tagY(HS) - 6} r={50 + (e - 24) * 9} fill="none" stroke="#5fe08a" strokeWidth={8 * Math.max(0, 1 - (e - 24) / 20)} opacity={Math.max(0, 1 - (e - 24) / 20)} /> : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 093: «Странно. Засчитали обоим.» — пожимает плечами, гасит свет */
const S93: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('093');
	const sh = env(e, 6, 40, 6, 8);
	const lightOff = grow(e, 62, 6);
	const p = gesture('shrug', idle(gf, 1), sh, f);
	const cam = usePush(camOn(1300, 540, 1.3), camOn(1340, 540, 1.5));
	return (
		<Stage cam={cam} bg="#262b48" light={{x: 20, y: 8, o: 0.3}}>
			<Layer depth={1.6}>
				<Room f={f} night />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={1520} floor={FL} s={HS} facing={-1} faceTurn={0.5} look={[-0.6, 0.2]} expr="worried" mouth={sh > 0.3 ? 'smirk' : undefined} pose={p} uid="h93" />
					<HT x={1530} s={1.15} ok auto showBpm bpm={86} yy={tagY(HS) - 6} />
					<rect x={1790} y={560} width={40} height={64} rx={8} fill="#f4f1e6" stroke="#10132a" strokeWidth={4} />
					<Onoma x={1760} y={520} text="ЩЁЛК" t={e - 60} c="#ffd34a" rot={-6} size={56} />
				</Svg>
			</Layer>
			<div style={{position: 'absolute', inset: 0, background: '#02030a', opacity: lightOff * 0.82}} />
		</Stage>
	);
};

export const PART6: ShotDef[] = [
	{at: '077', C: S77, whip: true},
	{at: '078', C: S78, whip: true},
	{at: '079', C: S79a},
	{at: '079', off: 85, C: S79b},
	{at: '080', C: S80, whip: true},
	{at: '082', C: S82},
	{at: '085', C: S85, own: true, ownCuts: []},
	{at: '086', C: S86, whip: true},
	{at: '088', C: S88, whip: true},
	{at: '089', C: S89},
	{at: '090', C: S90a},
	{at: '090', off: 110, C: S90b},
	{at: '091', C: S91},
	{at: '092', C: S92, whip: true},
	{at: '093', C: S93},
];
