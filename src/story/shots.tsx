import React from 'react';
import {interpolate} from 'remotion';
import {Pose, RIG, rigPoints, toLocal} from '../engine/Stickman';
import {blend, env, gesture, idle, reach, walkTo} from '../kit/actions';
import {Actor, counterAt, useShot, useSpeaking} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Extra, HeroBadge, Layer, Stage, Svg, camOn, clamp, ease, flash, usePush} from '../kit/kit';
import {Callout} from '../kit/graphics';
import {Board, FONT} from '../kit/ui';
import {Corridor} from '../kit/sets';
import {Onoma} from '../reference/PauseTime';
import {Bag, BoxStreet, Clock, Gym, Heart, Stairwell, Tag} from './places';
import {PART23} from './shots2';
import {PART45} from './shots3';
import {PART6} from './shots4';
import {PART78A} from './shots5';
import {PART78B} from './shots6';
import {FL, HS, HT, WRAP, Rope, bent, dirA, grow, guard, hands, hip, hit, tagY} from './common';

/* «Что если бы один пропуск обнулял 30 дней бокса?» — хук (001–007) и часть 1 (008–025).
   Остальные части — позже. Герой Саня — жёлтый, Тёма — красный. */


/* ================= ХУК ================= */

/* 001 N: «Двадцать три сорок одна. Ты стоишь у чужой двери и не можешь отдышаться.» */
const S1: React.FC = () => {
	const {f, gf} = useShot();
	const w = walkTo(f, 0, 40, -160, 700, 1, 0.5);
	const k = grow(f, 36, 12);
	let p = bent(blend(w.pose, idle(gf, 1), k), k);
	p = {...p, lean: p.lean + Math.sin(f / 3.2) * 2.2 * k};
	const cam = usePush(camOn(820, 560, 1.15), camOn(780, 590, 1.55));
	return (
		<Stage cam={cam} bg="#2a3550" light={{x: 20, y: 5, o: 0.35}}>
			<Layer depth={1.6}>
				<Stairwell f={f} />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<Clock x={600} y={330} text="23:41" s={1.5} blink f={f} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={w.x} floor={FL} s={HS} facing={1} faceTurn={0.3} look={[0.4, 0.6]} expr={k > 0.5 ? 'worried' : 'normal'} mouth={k > 0.5 ? 'open' : undefined} pose={p} vx={w.vx} bob={w.bob} uid="h1" />
					<g transform={`translate(${w.x - 52},${hip(HS) - 128 + 40 * k})`}>
						<rect width={44} height={86} rx={12} fill="#3a4256" stroke="#10132a" strokeWidth={3} />
						<rect x={8} y={-26} width={14} height={40} rx={6} fill="#e2483a" />
						<rect x={26} y={-30} width={14} height={44} rx={6} fill="#e2483a" />
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 002 N + 003 TEMA: две мигающие 29, дверь открывается, Тёма шепчет */
const S2: React.FC = () => {
	const {f, gf, at} = useShot();
	const sp = useSpeaking(gf);
	const open = grow(f, at('002') + 96, 14);
	const tin = grow(f, at('002') + 108, 8);
	const hx = 700;
	const up = grow(f, at('003'), 14);
	let hp = bent(idle(gf, 2), 1 - up * 0.7);
	hp = {...hp, lean: hp.lean + Math.sin(f / 3.2) * 1.6 * (1 - up)};
	let tp = idle(gf, 4);
	tp = gesture('shrug', tp, env(f, at('003') + 22, at('003') + 50, 6, 8), f);
	const glance = env(f, at('003') + 4, at('003') + 40, 8, 8);
	const tagIn = grow(f, at('002') + 38, 8);
	const wide = camOn(930, 560, 1.15);
	const camT = camOn(1030, 560, 1.5, {farBlur: 6});
	const camH = camOn(880, 560, 1.5, {farBlur: 6});
	const cam = sp === 'TEMA' ? camT : f > at('002') + 96 ? wide : camH;
	return (
		<Stage cam={cam} bg="#2a3550" light={{x: 20, y: 5, o: 0.35}}>
			<Layer depth={1.6}>
				<Stairwell f={f} open={open} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={hx} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0.2]} expr="worried" mouth="open" pose={hp} uid="h2" />
					{tagIn > 0.02 ? <HT x={hx + 20} s={1.0 * tagIn} warn bpm={150} yy={tagY(HS) + 70 * (1 - up)} /> : null}
					{tin > 0.02 ? (
						<>
							<Actor who="tema" x={1290} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.2 - glance * 0.7, -0.1]} expr="wide" mouth={sp === 'TEMA' ? undefined : 'flat'} pose={tp} uid="t2" />
							<Tag x={1290} y={tagY(1)} value={29} f={f} s={1.0 * tin} warn bpm={130} />
						</>
					) : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 004 N: «оба счётчика» — крупный план: два лица и две мигающие «29» (≈1,8 с) */
const S3c: React.FC = () => {
	const {f, gf} = useShot();
	const hp = bent({...idle(gf, 2), lean: 2 + Math.sin(f / 3.2) * 1.5}, 0.22);
	const cam = usePush(camOn(1010, 548, 1.95), camOn(1010, 542, 2.2));
	return (
		<Stage cam={cam} bg="#2a3550" light={{x: 20, y: 5, o: 0.35}}>
			<Layer depth={1.6}>
				<Stairwell f={f} open={1} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={700} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.9, 0.1]} expr="worried" mouth="open" pose={hp} uid="h3c" />
					<HT x={730} s={1.25} warn bpm={150} yy={tagY(HS) + 22} />
					<Actor who="tema" x={1290} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.9, 0.1]} expr="wide" mouth="flat" pose={idle(gf, 4)} uid="t3c" />
					<Tag x={1290} y={tagY(1)} value={29} f={f} s={1.25} warn bpm={130} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 004 N: «Через девятнадцать минут… вам нужно одиннадцать» — таймеры (два плана) */
const mkTimers = (variant: 'a' | 'b'): React.FC => () => {
	const {f, gf, at} = useShot();
	const e = f - at('004'); // кадров от начала реплики
	const left = Math.max(0, 19 * 60 - Math.floor(Math.max(0, e - 55) / 30));
	const mm = String(Math.floor(left / 60)).padStart(2, '0');
	const ss = String(left % 60).padStart(2, '0');
	const hp = bent(idle(gf, 2), 0.3);
	const cam = variant === 'a' ? usePush(camOn(740, 540, 1.35), camOn(800, 530, 1.65)) : usePush(camOn(1000, 520, 1.1), camOn(1020, 515, 1.28));
	const plate = (x: number, y: number, title: string, val: string, c: string, k: number) => (
		<g transform={`translate(${x},${y}) scale(${k})`} opacity={k}>
			<rect x={-250} y={-90} width={500} height={180} rx={20} fill="#10141f" stroke={c} strokeWidth={6} />
			<text x={0} y={-36} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={800} fill="#c8d0ea" letterSpacing={2}>
				{title}
			</text>
			<text x={0} y={62} textAnchor="middle" fontSize={96} fontFamily={FONT} fontWeight={900} fill={c}>
				{val}
			</text>
		</g>
	);
	return (
		<Stage cam={cam} bg="#2a3550" light={{x: 20, y: 5, o: 0.35}}>
			<Layer depth={1.6}>
				<Stairwell f={f} open={1} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={700} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0.2]} expr="worried" pose={hp} uid={'h3' + variant} />
					<HT x={720} s={1} warn bpm={150} yy={tagY(HS) + 56} />
					<Actor who="tema" x={1290} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.7, 0]} expr="wide" pose={idle(gf, 4)} uid={'t3' + variant} />
					<Tag x={1290} y={tagY(1)} value={29} f={f} s={1} warn bpm={130} />
					{plate(700, 310, 'ДО ПОЛУНОЧИ', `${mm}:${ss}`, '#ff6a5a', grow(e, 57, 10))}
					{plate(1300, 310, 'НУЖНО', '11:00', '#7fe0ff', grow(e, 132, 10))}
				</Svg>
			</Layer>
		</Stage>
	);
};
const S3a = mkTimers('a');
const S3b = mkTimers('b');

/* 005 HERO: «Пусти. У нас одиннадцать минут на двоих.» — a: идёт за героем, b: крупно в проёме */
const mkPush = (variant: 'a' | 'b'): React.FC => () => {
	const {f, at} = useShot();
	const t = f - at('005');
	const w = walkTo(t, 6, 52, 700, 1300, 1, 0.34);
	const tw = walkTo(t, 18, 50, 1290, 1540, 2, 0.22);
	const camA = camOn(Math.min(1180, w.x + 150), 560, 1.45 + 0.1 * (t / 40));
	const camB = usePush(camOn(1330, 560, 2.0), camOn(1350, 555, 2.35));
	const cam = variant === 'a' ? camA : camB;
	return (
		<Stage cam={cam} bg="#2a3550" light={{x: 20, y: 5, o: 0.35}}>
			<Layer depth={1.6}>
				<Stairwell f={f} open={1} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="tema" x={tw.x} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[0.6, 0]} expr="wide" pose={tw.pose} vx={tw.vx} bob={tw.bob} uid={'t4' + variant} />
					<Tag x={tw.x} y={tagY(1) - (variant === 'b' ? 80 : 0)} value={29} f={f} s={1} warn bpm={130} />
					<Actor who="hero" x={w.x} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.9, 0]} expr="angry" mouth="open" pose={w.pose} vx={w.vx} bob={w.bob} uid={'h4' + variant} />
					<g transform={`translate(${w.x - 52},${hip(HS) - 128})`}>
						<rect width={44} height={86} rx={12} fill="#3a4256" stroke="#10132a" strokeWidth={3} />
						<rect x={8} y={-26} width={14} height={40} rx={6} fill="#e2483a" />
						<rect x={26} y={-30} width={14} height={44} rx={6} fill="#e2483a" />
					</g>
					<HT x={w.x + 20} s={1} warn bpm={150} />
				</Svg>
			</Layer>
		</Stage>
	);
};
const S4a = mkPush('a');
const S4b = mkPush('b');

/* 006 N: заголовок = слова рассказчика («Что если бы над тобой висел счётчик дней, который сгорает за один пропуск?»);
   слова появляются в такт голосу; на «сгорает» табличка трескается в 0, на «пропуск» собирается обратно */
const TITLE: [string, number][][] = [
	[['ЧТО', 0], ['ЕСЛИ', 7], ['БЫ', 16], ['НАД', 24], ['ТОБОЙ', 31], ['ВИСЕЛ', 42]],
	[['СЧЁТЧИК', 52], ['ДНЕЙ,', 65], ['КОТОРЫЙ', 80], ['СГОРАЕТ', 92]],
	[['ЗА', 106], ['ОДИН', 111], ['ПРОПУСК?', 119]],
];
const S5: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('006');
	const crack = grow(e, 94, 3);
	const mend = grow(e, 128, 14);
	const broken = crack > 0 && mend < 1;
	const shake = broken ? crack * (1 - mend) * Math.sin(f * 2.1) * 6 : 0;
	const v = counterAt(gf);
	const pop = 1 + 0.15 * Math.exp(-Math.max(0, e - 94) / 5) * crack;
	return (
		<Board tint="#241638">
			{TITLE.map((line, li) => (
				<text key={li} x={960} y={190 + li * 120} textAnchor="middle" fontSize={96} fontFamily={FONT} fontWeight={900} fill={li === 2 ? '#ffc94a' : '#fff'}>
					{line.map(([w, t], i) => (
						<tspan key={i} fillOpacity={interpolate(e, [t, t + 6], [0, 1], clamp)}>
							{w}
							{i < line.length - 1 ? ' ' : ''}
						</tspan>
					))}
				</text>
			))}
			<g transform={`translate(${shake},${800})`}>
				<Tag x={880} y={0} value={v} f={f} s={2.6 * pop} warn={broken} bpm={broken ? 0 : 90} />
				{crack > 0 && mend < 0.5 ? (
					<g stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={1 - mend * 2}>
						<path d="M770,-60 L810,-10 L780,30 L840,80" />
						<path d="M980,-80 L950,-30 L1010,10 L970,70" />
					</g>
				) : null}
			</g>
		</Board>
	);
};

/* 007 N: «Давай отмотаем на двадцать девять дней назад.» — часы и листки календаря назад */
const S6: React.FC = () => {
	const {f, gf, at} = useShot();
	const run = grow(f, at('007') + 10, 50);
	const ang = -run * 360 * 3;
	return (
		<Board tint="#162a45">
			<g transform="translate(960,520)">
				<circle r={260} fill="#f2efe6" stroke="#10141f" strokeWidth={14} />
				{Array.from({length: 12}).map((_, i) => (
					<line key={i} x1={0} y1={-220} x2={0} y2={-244} stroke="#10141f" strokeWidth={8} transform={`rotate(${i * 30})`} />
				))}
				<line x1={0} y1={0} x2={0} y2={-180} stroke="#10141f" strokeWidth={12} strokeLinecap="round" transform={`rotate(${ang})`} />
				<line x1={0} y1={0} x2={0} y2={-120} stroke="#c9342a" strokeWidth={16} strokeLinecap="round" transform={`rotate(${ang / 12})`} />
				<circle r={16} fill="#10141f" />
			</g>
			{Array.from({length: 14}).map((_, i) => {
				const t = Math.max(0, f - (at('007') + 6) - i * 3);
				const x = 260 + ((i * 197) % 1400) + t * (i % 2 ? 6 : -6);
				const y = 900 - t * (10 + (i % 4) * 3);
				return (
					<g key={i} transform={`translate(${x},${y}) rotate(${(i % 2 ? 1 : -1) * t * 5}) scale(1.9)`} opacity={interpolate(t, [0, 6, 40, 60], [0, 1, 1, 0], clamp)}>
						<rect x={-34} y={-40} width={68} height={80} rx={6} fill="#fff" />
						<rect x={-34} y={-40} width={68} height={20} rx={6} fill="#e2483a" />
						<text y={26} textAnchor="middle" fontSize={40} fontFamily={FONT} fontWeight={800} fill="#10141f">
							{29 - ((i + Math.floor(t / 3)) % 29)}
						</text>
					</g>
				);
			})}
			<g opacity={grow(f, at('007') + 24, 10)}>
				<text x={960} y={920} textAnchor="middle" fontSize={96} fontFamily={FONT} fontWeight={900} fill="#ffc94a">
					−29 ДНЕЙ
				</text>
			</g>
		</Board>
	);
};

/* ================= ЧАСТЬ 1 ================= */

/* 008 N: улица, вывеска «БОКС», герой подходит, отходит, снова подходит */
const S7: React.FC = () => {
	const {f, gf, at} = useShot();
	const t = f - 10;
	// три подхода: 700 → 880 → 760 → 900 → 800 → 960
	const xs = [620, 880, 700, 890, 760, 960];
	const ts = [0, 50, 85, 130, 165, 215];
	const x = interpolate(t, ts, xs, {...clamp, easing: ease});
	const dir = interpolate(t, [0, 50, 55, 85, 90, 130, 135, 165, 170, 215], [1, 1, -1, -1, 1, 1, -1, -1, 1, 1], clamp) >= 0 ? 1 : -1;
	const mv = Math.abs(interpolate(t, ts, xs, clamp) - interpolate(t - 1, ts, xs, clamp));
	const w = walkTo(f, 0, 9999, 0, 0, 1, 0.3);
	const stepping = mv > 0.15;
	const pose = stepping ? {...(walkTo(f, 0, 9999, 0, 1, 1, 0.3).pose)} : idle(gf, 1);
	const scratch = env(f, 100, 160, 8, 8);
	const p2 = gesture('scratch', pose, scratch * (stepping ? 0 : 1), f);
	const cam = usePush(camOn(900, 520, 1.15), camOn(930, 540, 1.4));
	return (
		<Stage cam={cam} bg="#3b4a78" light={{x: 70, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<BoxStreet f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={x} floor={FL} s={HS} facing={dir as 1 | -1} faceTurn={0.3} look={[dir * 0.7, 0]} expr={stepping ? 'normal' : 'worried'} pose={p2} vx={mv} bob={stepping ? w.bob : 0} uid="h7" />
					<Callout f={f} t0={at('008') + 100} t1={at('008') + 170} from={[x, 640]} to={[x - 230 * dir, 700]} text="ПРОСТО ПРОХОЖУ" align="center" size={34} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 009 N: вспышка-флешбек — школьный коридор, одноклассник шутя замахивается */
const S8: React.FC = () => {
	const {f, gf, at} = useShot();
	const swing = env(f, at('009') + 40, at('009') + 66, 8, 8);
	const stop = grow(f, at('009') + 40, 10);
	let kp = idle(gf, 3);
	kp = reach(kp, 'F', [60, -150], swing);
	kp = {...kp, lean: kp.lean + 12 * swing};
	let hp = idle(gf, 1);
	hp = {...hp, lean: hp.lean - 14 * swing, head: hp.head - 10 * swing};
	hp = reach(reach(hp, 'F', [26, -138], swing), 'B', [20, -132], swing);
	const kx = 620 + 40 * stop;
	const cam = usePush(camOn(820, 560, 1.4), camOn(850, 560, 1.7));
	return (
		<Stage cam={cam} bg="#cdbf98" light={{x: 20, y: 10, o: 0.3}} grain={0.5}>
			<Layer depth={1.6}>
				<Corridor f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="kid" x={kx} floor={FL} s={1} facing={1} faceTurn={0.5} look={[0.8, 0]} expr="normal" mouth={swing > 0.3 ? 'smirk' : undefined} pose={kp} uid="k8" />
					<Actor who="hero" x={900} floor={FL} s={0.95} facing={-1} faceTurn={0.4} look={[-0.8, 0]} expr={swing > 0.3 ? 'wide' : 'normal'} lidL={swing} lidR={swing} pose={hp} uid="h8" />
					<Onoma x={760} y={560} text="ВЖУХ" t={f - (at('009') + 54)} c="#fff" rot={-10} size={58} />
				</Svg>
			</Layer>
			<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(255,240,200,0) 40%, rgba(60,40,20,0.55) 100%)', mixBlendMode: 'multiply'}} />
		</Stage>
	);
};

/* 010 N + 011 HERO: заходит в зал, над головой загорается «1», «Это ещё что?» */
const S9: React.FC = () => {
	const {f, gf, at} = useShot();
	const w = walkTo(f, 0, 56, -200, 640, 1, 0.3);
	const wave = env(f, at('011') + 2, at('011') + 24, 4, 6);
	let p = w.pose;
	p = reach(p, 'F', [20, -250], wave * (0.6 + 0.4 * Math.sin(f / 2.5)));
	const up = grow(f, at('010') + 70, 6);
	const cam = usePush(camOn(700, 540, 1.25), camOn(720, 500, 1.5));
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} ring />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Bag x={1500} angle={0} />
					<Actor who="hero" x={w.x} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.6, up > 0.5 ? -0.8 : 0]} expr={up > 0.5 ? 'wide' : 'normal'} pose={p} vx={w.vx} bob={w.bob} uid="h9" />
					{counterAt(gf) >= 1 ? (
						<>
							<HeroBadge x={w.x} y={tagY(HS)} s={1.04} />
							<Heart x={w.x + 150} y={tagY(HS) - 4} f={f} bpm={72} s={1.04} />
						</>
					) : null}
				</Svg>
			</Layer>
			<div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash(f, at('010') + 62, 8) * 0.5}} />
		</Stage>
	);
};

/* люди в зале с табличками */
const PersonTag: React.FC<{x: number; s: number; v: number; f: number; bpm?: number}> = ({x, s, v, f, bpm = 70}) => <Tag x={x} y={tagY(s)} value={v} f={f} s={0.91} bpm={bpm} />;

/* 012 N + 013 N: панорама зала; дед со скакалкой (1 400), девушка у груши (212) */
const S10: React.FC = () => {
	const {f, gf, at} = useShot();
	const jump = Math.abs(Math.sin(f / 4.6));
	const ga = f / 4.6 * 1; // скакалка деда крутится ровно, как метроном
	let gp = idle(gf, 5);
	gp = reach(reach(gp, 'F', [34, -20], 1), 'B', [22, -22], 1);
	gp = {...gp, legF: [gp.legF[0] + 6, 22 * jump], legB: [gp.legB[0] - 4, 22 * jump]};
	const t0 = at('013') + 40;
	let lp = guard(idle(gf, 6), 0.8);
	for (let i = 0; i < 6; i++) lp = hit(lp, i % 2 ? 'B' : 'F', 1560, 1, -1, [1500, 640], env(f, t0 + i * 16, t0 + i * 16 + 11, 3, 5));
	let bag = 0;
	for (let i = 0; i < 6; i++) {
		const d = f - (t0 + i * 16 + 5);
		if (d > 0) bag += 4 * Math.exp(-d / 16) * Math.cos(d / 5);
	}
	let ep = guard(idle(gf, 7), 0.6);
	const pan = interpolate(f, [0, at('013') + 30, at('013') + 150], [700, 940, 1320], {...clamp, easing: ease});
	const cam = camOn(pan, 560, 1.3);
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} ring />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={450} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.9, 0]} expr="wide" pose={idle(gf, 1)} uid="h10" />
					<HeroBadge x={450} y={tagY(HS)} s={1.04} />
					<Heart x={600} y={tagY(HS) - 4} f={f} bpm={72} s={1.04} />
					<Extra i={3} x={760} floor={FL} s={0.96} facing={1} pose={{...idle(gf, 8), armF: [-80 + Math.sin(f / 6) * 20, 30], armB: [80, 30]}} seed="g" />
					<PersonTag x={760} s={0.96} v={7} f={f} />
					<Actor who="grandpa" x={1130} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.3, 0.2]} expr="normal" pose={gp} bob={jump * 14} uid="g10" />
					<Rope p={gp} x={1130} s={1} facing={-1} a={ga} c="#3fc1c9" />
					<Tag x={1130} y={tagY(1) - jump * 14} value={1400} f={f} s={0.94} bpm={65} />
					<Bag x={1500} angle={bag} />
					<Actor who="girl" x={1560} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.9, 0]} expr="angry" pose={lp} uid="l10" />
					<Tag x={1560} y={tagY(1)} value={212} f={f} s={0.94} bpm={110} />
					<Extra i={5} x={1870} floor={FL} s={0.97} facing={-1} pose={ep} seed="e" />
					<PersonTag x={1870} s={0.97} v={19} f={f} bpm={90} />
					<Callout f={f} t0={at('013') + 12} t1={at('013') + 64} from={[1130, 560]} to={[1130, 330]} text="1 400" align="center" size={44} />
					<Callout f={f} t0={at('013') + 66} t1={at('013') + 120} from={[1560, 560]} to={[1560, 330]} text="212" align="center" size={44} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 014 N: Вован у зеркала, поправляет табличку как корону */
const S11: React.FC = () => {
	const {f, gf, at} = useShot();
	const pose1 = env(f, at('014') + 30, at('014') + 80, 8, 8);
	const fix = env(f, at('014') + 80, at('014') + 128, 8, 8);
	const pose2 = env(f, at('014') + 128, at('014') + 175, 8, 8);
	let vp = idle(gf, 3);
	// бицепс, потом рука к табличке над головой, потом в бок
	vp = reach(reach(vp, 'F', [30, -150], pose1), 'B', [10, -130], pose1);
	vp = reach(vp, 'F', [10, -300], fix);
	vp = gesture('armsCrossed', vp, pose2, f);
	const cam = usePush(camOn(980, 520, 1.3), camOn(1000, 480, 1.5));
	const vs = 1.25;
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<rect x={760} y={190} width={620} height={520} rx={10} fill="#2a3042" />
					<rect x={776} y={206} width={588} height={488} rx={6} fill="#a9c8e0" />
					<polygon points="800,206 900,206 780,694 776,694 776,500" fill="#fff" opacity={0.18} />
					<polygon points="1000,206 1060,206 930,694 880,694" fill="#fff" opacity={0.12} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="vovan" x={1180} floor={FL} s={vs} facing={-1} faceTurn={0.6} look={[-0.9, 0]} expr="normal" mouth={pose1 > 0.5 ? 'smirk' : undefined} pose={vp} uid="v11" />
					<g transform={`translate(0,${-fix * 8})`}>
						<Tag x={1180} y={tagY(vs) - 12} value={41} f={f} s={1.17} bpm={60} />
						<path d={`M1130,${tagY(vs) - 66} l14,-34 l22,22 l22,-30 l22,30 l22,-22 l14,34 Z`} fill="#ffd34a" stroke="#10132a" strokeWidth={4} opacity={grow(f, at('014') + 90, 10)} transform="translate(-16,0)" />
					</g>
					<Actor who="hero" x={720} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.9, 0]} expr="normal" pose={idle(gf, 1)} uid="h11" />
									</Svg>
			</Layer>
		</Stage>
	);
};

/* 015 TRAINER: бросает бинты, показывает на свою кисть */
const S12: React.FC = () => {
	const {f, gf, at} = useShot();
	const tw = walkTo(f, -4, 36, 1500, 1060, 3, 0.3);
	const toss = env(f, at('015') + 4, at('015') + 24, 4, 10);
	let tp = tw.pose;
	tp = reach(tp, 'F', [50, -110], toss);
	const point = env(f, at('015') + 52, at('015') + 105, 8, 10);
	tp = reach(tp, 'F', [60, -110], point);
	// бинты летят дугой к герою
	const fl = interpolate(f, [at('015') + 10, at('015') + 34], [0, 1], clamp);
	const wx = interpolate(fl, [0, 1], [1010, 700]);
	const wy = 640 - Math.sin(fl * Math.PI) * 170 + fl * 80;
	const catchK = grow(f, at('015') + 34, 6);
	let hp = idle(gf, 1);
	hp = reach(hp, 'F', [40, -80], catchK);
	const cam = camOn(880, 560, 1.4);
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={640} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0]} expr="normal" pose={hp} uid="h12" />
					<HeroBadge x={640} y={tagY(HS)} s={1.04} />
					<Heart x={790} y={tagY(HS) - 4} f={f} bpm={72} s={1.04} />
					<Actor who="trainer" x={tw.x} floor={FL} s={1.02} facing={-1} faceTurn={0.6} look={[-0.9, 0]} pose={tp} vx={tw.vx} bob={tw.bob} uid="t12" />
					{fl < 1 ? (
						<g transform={`translate(${wx},${wy}) rotate(${f * 14})`}>
							<circle r={22} fill={WRAP} stroke="#10132a" strokeWidth={3} />
							<circle r={8} fill="#c9342a" />
						</g>
					) : null}
					<Callout f={f} t0={at('015') + 56} t1={at('015') + 108} from={[tw.x - 60, 610]} to={[tw.x - 150, 440]} text="МЕЛКИЕ КОСТИ" align="center" size={34} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 016 N: схема кисти — бинт наматывается слоями, кости подсвечиваются */
const S13: React.FC = () => {
	const {f, at} = useShot();
	const wrap = grow(f, at('016') + 60, 80);
	const glow = 0.5 + 0.5 * Math.sin(f / 6);
	const bones: [number, number, number, number][] = [
		[760, 520, 700, 260],
		[860, 520, 850, 220],
		[960, 520, 990, 200],
		[1060, 520, 1130, 240],
		[1130, 590, 1300, 470],
	];
	return (
		<Board tint="#14263f">
			<text x={960} y={120} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#fff">
				КИСТЬ — ЭТО МЕЛКИЕ КОСТИ
			</text>
			<path d="M700,560 C690,420 700,300 710,250 C760,200 800,220 800,260 L810,230 C820,190 880,190 880,230 L890,215 C900,175 960,175 965,220 L980,230 C990,195 1050,200 1050,250 L1075,300 C1120,340 1140,420 1230,430 C1300,430 1330,470 1280,505 C1230,540 1160,560 1130,640 L1100,780 L760,780 Z" fill="#e8c9a0" stroke="#10132a" strokeWidth={8} strokeLinejoin="round" />
			{bones.map(([x1, y1, x2, y2], i) => (
				<g key={i}>
					<line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth={22} strokeLinecap="round" opacity={0.95} />
					<circle cx={x2} cy={y2} r={20 + glow * 6} fill="#ffc94a" opacity={0.4 + glow * 0.4} />
					<circle cx={x2} cy={y2} r={13} fill="#fff" />
				</g>
			))}
			{Array.from({length: 10}).map((_, i) => (
				<path key={i} d={`M690,${500 + i * 28} Q930,${450 + i * 28} 1180,${548 + i * 28}`} stroke={WRAP} strokeWidth={22} fill="none" opacity={wrap * 10 > i ? 0.97 : 0} />
			))}
			<Callout f={f} t0={at('016') + 26} t1={at('016') + 120} from={[990, 200]} to={[1420, 180]} text="МЕЛКИЕ КОСТИ" size={44} />
			<Callout f={f} t0={at('016') + 100} t1={at('016') + 164} from={[940, 600]} to={[1420, 640]} text="БИНТ ДЕРЖИТ ИХ" size={44} c="#9ff0b0" />
		</Board>
	);
};

/* меловая доска в зале: строки проявляются слева направо */
const Chalk: React.FC<{x: number; y: number; text: string; k: number; size?: number}> = ({x, y, text, k, size = 70}) => (
	<text x={x} y={y} fontSize={size} fontFamily={FONT} fontWeight={800} fill="#f4f1e6" opacity={0.94}>
		{text.slice(0, Math.ceil(text.length * k))}
	</text>
);

/* 017 TRAINER + 018 TRAINER: доска «33 ДНЯ», «3 — БОЛЕЗНЬ», потом стучит по «30» */
const S14: React.FC = () => {
	const {f, gf, at} = useShot();
	const write = env(f, at('017') + 4, at('017') + 70, 6, 6);
	let tp = idle(gf, 3);
	tp = reach(tp, 'F', [60, -210 + Math.sin(f / 3) * 18], write);
	const knock = env(f, at('018') + 6, at('018') + 56, 5, 8);
	tp = reach(tp, 'F', [66, -190 + Math.sin(f / 3.4) * 24], knock);
	const k1 = grow(f, at('017') + 6, 40);
	const k2 = grow(f, at('017') + 52, 40);
	const k3 = grow(f, at('018') + 2, 20);
	const cam = usePush(camOn(1120, 520, 1.35), camOn(1160, 500, 1.6));
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<rect x={1180} y={200} width={640} height={440} rx={10} fill="#6e4a2e" />
					<rect x={1196} y={216} width={608} height={408} rx={6} fill="#27413a" />
					<Chalk x={1230} y={340} text="33 ДНЯ" k={k1} size={100} />
					<Chalk x={1230} y={460} text="3 — БОЛЕЗНЬ" k={k2} size={74} />
					<g opacity={k3}>
						<text x={1230} y={580} fontSize={92} fontFamily={FONT} fontWeight={900} fill="#ffd34a">
							ДО 30
						</text>
						<ellipse cx={1330} cy={555} rx={140} ry={64} fill="none" stroke="#ffd34a" strokeWidth={6} />
					</g>
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="trainer" x={1060} floor={FL} s={1.02} facing={1} faceTurn={0.6} look={[0.9, -0.3]} pose={tp} uid="t14" />
					<Actor who="hero" x={640} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.9, -0.1]} expr="normal" pose={idle(gf, 1)} uid="h14" />
					<HeroBadge x={640} y={tagY(HS)} s={1.04} />
					<Heart x={790} y={tagY(HS) - 4} f={f} bpm={72} s={1.04} />
					<Onoma x={1250} y={700} text="ТУК" t={f - (at('018') + 20)} c="#fff" rot={-6} size={48} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 019 N: все разминаются, никто не поднимает голову */
const S15: React.FC = () => {
	const {f, gf} = useShot();
	const sw = Math.sin(f / 10);
	const ps = [
		{x: 640, p: {...idle(gf, 1), lean: 20 + sw * 14, head: 8, armF: [90, 10] as [number, number], armB: [80, 10] as [number, number]}, v: 5},
		{x: 900, p: {...idle(gf, 2), armF: [-90 + sw * 40, 8] as [number, number], armB: [90 - sw * 40, 8] as [number, number]}, v: 12},
		{x: 1160, p: {...idle(gf, 3), lean: 6, head: 16, armF: [150 + sw * 20, 12] as [number, number], armB: [160, 10] as [number, number]}, v: 88},
		{x: 1420, p: {...idle(gf, 4), lean: 24 - sw * 10, head: 10, armF: [60, 14] as [number, number], armB: [50, 14] as [number, number]}, v: 340},
	];
	const cam = usePush(camOn(900, 560, 1.2), camOn(1000, 560, 1.3));
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} ring />
			</Layer>
			<Layer depth={1}>
				<Svg>
					{ps.map((q, i) => (
						<g key={i}>
							<Extra i={10 + i} x={q.x} floor={FL} s={1} facing={i % 2 ? -1 : 1} pose={q.p} seed="w" />
							<PersonTag x={q.x} s={1} v={q.v} f={f} />
						</g>
					))}
					<Actor who="hero" x={400} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.6, -0.2]} expr="worried" pose={idle(gf, 1)} uid="h15" />
					<HeroBadge x={400} y={tagY(HS)} s={1.04} />
					<Heart x={550} y={tagY(HS) - 4} f={f} bpm={72} s={1.04} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 020 N: нарисованное мелом «212» осыпается в «0», вокруг — глаза */
const S16: React.FC = () => {
	const {f, at} = useShot();
	const fall = grow(f, at('020') + 36, 40);
	const eyes = grow(f, at('020') + 56, 20);
	return (
		<Board tint="#1d3a33">
			<text x={960} y={140} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={800} fill="#f4f1e6" opacity={0.9}>
				ПРОПУСТИЛ ДЕНЬ — В ПОЛНОЧЬ ОБНУЛЕНИЕ
			</text>
			<rect x={560} y={300} width={800} height={380} rx={190} fill="none" stroke="#f4f1e6" strokeWidth={10} strokeDasharray="22 12" opacity={0.9} />
			{['2', '1', '2'].map((d, i) => (
				<text key={i} x={760 + i * 190} y={560 + fall * (180 + i * 90)} textAnchor="middle" fontSize={230} fontFamily={FONT} fontWeight={900} fill="#f4f1e6" transform={`rotate(${fall * (i - 1) * 40} ${760 + i * 190} 500)`} opacity={1 - fall * 0.85}>
					{d}
				</text>
			))}
			<text x={960} y={560} textAnchor="middle" fontSize={230} fontFamily={FONT} fontWeight={900} fill="#ff6a5a" opacity={fall} transform={`scale(${0.6 + fall * 0.4})`} style={{transformOrigin: '960px 500px'}}>
				0
			</text>
			{[[300, 250], [450, 520], [1500, 260], [1560, 500], [1380, 740], [520, 780]].map(([x, y], i) => (
				<g key={i} transform={`translate(${x},${y})`} opacity={eyes}>
					<ellipse rx={46} ry={26} fill="#f4f1e6" />
					<circle cx={Math.cos(f / 12 + i) * 12 + (960 - x) * 0.02} cy={Math.sin(f / 15 + i) * 6} r={14} fill="#10132a" />
				</g>
			))}
		</Board>
	);
};

/* 021–023: Тёма запутался в бинтах, Саня помогает намотать, оба смеются */
const S17: React.FC = () => {
	const {f, gf, at} = useShot();
	const sp = useSpeaking(gf);
	const tin = walkTo(f, -6, 30, 1400, 1120, 6, 0.28);
	const hold = env(f, at('022') + 8, at('022') + 60, 6, 6);
	const help = grow(f, at('023') + 2, 12);
	let tp = idle(gf, 4);
	tp = reach(tp, 'F', [50, -90], hold);
	const laugh = grow(f, at('023') + 30, 8);
	let hp = idle(gf, 1);
	hp = reach(hp, 'F', [56, -88], help);
	hp = reach(hp, 'B', [40, -80], help * 0.8);
	const cam = sp === 'TEMA' ? camOn(1160, 560, 1.55, {farBlur: 5}) : sp === 'HERO' ? camOn(860, 560, 1.55, {farBlur: 5}) : camOn(990, 560, 1.3);
	const unr = 1 - help * 0.9;
	const wrapEnd: [number, number] = [tin.x - 78, hip(1) - 90];
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={860} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.9, 0.2]} expr="normal" mouth={laugh > 0.5 ? 'smile' : undefined} pose={hp} uid="h17" />
					<HeroBadge x={860} y={tagY(HS)} s={1.04} />
					<Heart x={1010} y={tagY(HS) - 4} f={f} bpm={72} s={1.04} />
					<Actor who="tema" x={tin.x} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.9, 0.3]} expr={laugh > 0.5 ? 'normal' : 'worried'} mouth={laugh > 0.5 ? 'smile' : undefined} pose={tp} vx={tin.vx} bob={tin.bob} uid="t17" />
					<Tag x={tin.x} y={tagY(1)} value={1} f={f} s={1.04} bpm={72} />
					{/* бинт, размотанный на полметра, путается у ног */}
					<path d={`M${wrapEnd[0]},${wrapEnd[1]} C${wrapEnd[0] - 40},${FL - 120} ${wrapEnd[0] + 80 * unr},${FL - 10} ${wrapEnd[0] - 120 * unr},${FL + 20} S${wrapEnd[0] - 260 * unr},${FL + 6} ${wrapEnd[0] - 300 * unr},${FL + 30}`} stroke={WRAP} strokeWidth={14} fill="none" strokeLinecap="round" />
					<Onoma x={1000} y={640} text="ХА-ХА" t={f - (at('023') + 34)} c="#ffd34a" rot={-6} size={48} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 024 TRAINER: скакалки обоим; герой цепляется ногой с первого прыжка */
const S18: React.FC = () => {
	const {f, gf, at} = useShot();
	const tw = walkTo(f, -4, 28, 1500, 1330, 3, 0.3);
	const give = env(f, at('024') + 6, at('024') + 30, 4, 8);
	let tp = reach(tw.pose, 'F', [50, -70], give);
	const start = at('024') + 40;
	const trip = grow(f, start + 40, 8);
	const jmp = f > start ? Math.abs(Math.sin((f - start) / 4.5)) * (1 - trip) : 0;
	let hp = reach(reach(idle(gf, 1), 'F', [34, -20], 1), 'B', [22, -22], 1);
	hp = {...hp, legF: [hp.legF[0] + 6, 22 * jmp], legB: [hp.legB[0] - 4, 22 * jmp], lean: hp.lean + 28 * trip, head: hp.head + 14 * trip};
	let tm = reach(reach(idle(gf, 4), 'F', [34, -20], 1), 'B', [22, -22], 1);
	const jt = f > start ? Math.abs(Math.sin((f - start) / 4.1)) : 0;
	tm = {...tm, legF: [tm.legF[0] + 6, 22 * jt], legB: [tm.legB[0] - 4, 22 * jt]};
	const a = Math.max(0, f - start) / 4.5;
	const cam = camOn(1010, 540, 1.3);
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={760} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.4, 0.5]} expr={trip > 0.4 ? 'wide' : 'normal'} pose={hp} bob={jmp * 14} squash={trip * 0.06} uid="h18" />
					<Rope p={hp} x={760} s={HS} facing={1} a={a} c="#ffd34a" k={f > start - 4 ? 1 : 0.0} />
					<HeroBadge x={760} y={tagY(HS) - jmp * 14} s={1.04} />
					<Actor who="tema" x={1010} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.4, 0.5]} expr="normal" pose={tm} bob={jt * 14} uid="t18" />
					<Rope p={tm} x={1010} s={1} facing={-1} a={a * 0.9 + 1} c="#e86aa0" k={f > start - 4 ? 1 : 0} />
					<Tag x={1010} y={tagY(1) - jt * 14} value={1} f={f} s={1.04} bpm={80} />
					<Actor who="trainer" x={tw.x} floor={FL} s={1.02} facing={-1} faceTurn={0.6} look={[-0.9, 0]} pose={tp} vx={tw.vx} bob={tw.bob} uid="t18b" />
					<Onoma x={790} y={850} text="ШЛЁП" t={f - (start + 44)} c="#ffd34a" rot={-8} size={50} />
					<Callout f={f} t0={at('024') + 8} t1={at('024') + 56} from={[tw.x - 40, 700]} to={[tw.x + 10, 440]} text="10 МИНУТ" align="center" size={40} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 025 N: часы 19:30, Тёма хватает сумку и убегает, дверь хлопает */
const S19: React.FC = () => {
	const {f, gf, at} = useShot();
	const grab = env(f, at('025') + 36, at('025') + 60, 6, 6);
	const run = walkTo(f, at('025') + 56, at('025') + 92, 1220, 2200, 5, 0.9);
	let tp = f < at('025') + 56 ? reach(idle(gf, 4), 'F', [30, 40], grab) : run.pose;
	const cam = usePush(camOn(1050, 520, 1.2), camOn(1250, 520, 1.3));
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<Clock x={1000} y={270} text="19:30" s={1.3} f={f} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={700} floor={FL} s={HS} facing={1} faceTurn={0.5} look={[0.9, 0]} expr="wide" pose={idle(gf, 1)} uid="h19" />
					<HeroBadge x={700} y={tagY(HS)} s={1.04} />
					<Heart x={850} y={tagY(HS) - 4} f={f} bpm={72} s={1.04} />
					<rect x={1180} y={FL - 36} width={64} height={36} rx={10} fill="#3a4256" stroke="#10132a" strokeWidth={3} opacity={f < at('025') + 52 ? 1 : 0} />
					<Actor who="tema" x={run.x} floor={FL} s={1} facing={f < at('025') + 56 ? -1 : 1} faceTurn={0.5} look={[0.9, 0]} expr="worried" pose={tp} vx={run.vx} bob={run.bob} uid="t19" />
					<Tag x={run.x} y={tagY(1)} value={1} f={f} s={1.04} bpm={f < at('025') + 56 ? 80 : 120} />
					<Onoma x={1860} y={620} text="ХЛОП!" t={f - (at('025') + 100)} c="#ffd34a" rot={-8} size={64} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 127: заглушка до части 9 */
const Pending: React.FC = () => (
	<Board tint="#101626">
		<text x={960} y={560} textAnchor="middle" fontSize={80} fontFamily={FONT} fontWeight={900} fill="#c8d0ea">
			ЧАСТЬ 9 — ПОЗЖЕ
		</text>
	</Board>
);

export const SHOTS: ShotDef[] = [
	{at: '001', C: S1},
	{at: '002', C: S2},
	{at: '004', C: S3c},
	{at: '004', off: 55, C: S3a},
	{at: '004', off: 130, C: S3b},
	{at: '005', C: S4a},
	{at: '005', off: 34, C: S4b},
	{at: '006', C: S5, own: true, ownCuts: []},
	{at: '007', C: S6, own: true, ownCuts: [], whip: true},
	{at: '008', C: S7, whip: true},
	{at: '009', C: S8, whip: true},
	{at: '010', C: S9, whip: true},
	{at: '012', C: S10},
	{at: '014', C: S11},
	{at: '015', C: S12},
	{at: '016', C: S13, own: true, ownCuts: []},
	{at: '017', C: S14, whip: true},
	{at: '019', C: S15},
	{at: '020', C: S16, own: true, ownCuts: []},
	{at: '021', C: S17, whip: true},
	{at: '024', C: S18},
	{at: '025', C: S19},
	...PART23,
	...PART45,
	...PART6,
	...PART78A,
	...PART78B,
	{at: '127', C: Pending, own: true, ownCuts: []},
];
