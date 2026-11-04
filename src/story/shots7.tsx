import React from 'react';
import {interpolate} from 'remotion';
import {Pose, toLocal} from '../engine/Stickman';
import {blend, env, gesture, idle, reach, walk, walkTo} from '../kit/actions';
import {Actor, counterAt, useShot, useSpeaking} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Layer, Stage, Svg, camOn, clamp, ease, usePush} from '../kit/kit';
import {Bubble, Board, FONT} from '../kit/ui';
import {Onoma} from '../reference/PauseTime';
import {Clock, Flat, Gym, HideHud, Stairwell, Tag} from './places';
import {useContext} from 'react';
import {FL, HS, HT, grow, guard, hands, hip, hit, tagY} from './common';
import {Chalk, FS, hand, pill, shadow} from './shots2';
import {Led} from './shots5';

/* Часть 9 (127–147): кульминация. Первый кадр = кадр хука: та же дверь, часы 23:41, две мигающие «29».
   Время сцены: 23:41 → 23:44 (подготовка) → 23:44–23:55 (11 минут: 3+1+3+1+3) → 00:00. */
// кадр → минуты суток
const KEYS: [number, number][] = [[16445, 1421], [16833, 1424], [17524, 1424], [17743, 1426], [17988, 1427], [18088, 1427.5], [18210, 1428], [18400, 1430], [18464, 1431], [18560, 1431.5], [18690, 1432], [18713, 1434], [18903, 1435], [19201, 1440]];
export const mins = (gf: number) => interpolate(gf, KEYS.map((k) => k[0]), KEYS.map((k) => k[1]), clamp);
export const hms = (m: number, sec = false) => {
	const h = Math.floor(m / 60) % 24;
	const mm = Math.floor(m) % 60;
	const ss = Math.round((m % 1) * 60);
	return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}${sec && ss ? ':' + String(ss).padStart(2, '0') : ''}`;
};
const SEGS: [number, number, string, string][] = [[0, 3, '#e2483a', 'РАУНД 1'], [3, 4, '#5a6280', 'ОТДЫХ'], [4, 7, '#e2483a', 'РАУНД 2'], [7, 8, '#5a6280', 'ОТДЫХ'], [8, 11, '#e2483a', 'РАУНД 3']];
const SWAPS = [2, 3.5, 6, 7.5, 10];
export const roundNow = (m: number) => {
	const t = m - 1424;
	if (t >= 10.99 && t < 11.4) return 'РАУНД 3 · 0:00';
	const s = SEGS.find(([a, b]) => t >= a && t < b);
	if (!s) return null;
	const left = (s[1] - t) * 60;
	return `${s[3]} · ${Math.floor(left / 60)}:${String(Math.floor(left % 60)).padStart(2, '0')}`;
};
/* экранная шкала 23:44 → 23:55: сегменты раундов, отметки смен полотенца, бегунок */
const Hud: React.FC<{gf: number; bar?: boolean; big?: boolean}> = ({gf, bar = true, big}) => {
	const hidden = useContext(HideHud);
	if (hidden) return null;
	const m = mins(gf);
	const swapNow = SWAPS.some((s) => Math.abs(m - (1424 + s)) < 0.12);
	const X0 = 700;
	const W = 1180;
	const px = (t: number) => X0 + (t / 11) * W;
	const lbl = roundNow(m);
	const short = (t: number) => (t % 1 ? hms(1424 + t).slice(3) + ':30' : hms(1424 + t));
	return (
		<>
			<Led text={hms(m, swapNow)} size={104} />
			{bar ? (
				<svg width={1920} height={300} style={{position: 'absolute', left: 0, top: 0}}>
					{SEGS.map(([a, b, c, t], i) => (
						<g key={i}>
							<rect x={px(a) + 2} y={40} width={px(b) - px(a) - 4} height={104} rx={20} fill={c} stroke="#10132a" strokeWidth={6} opacity={0.95} />
							<text x={(px(a) + px(b)) / 2} y={110} textAnchor="middle" fontSize={b - a === 3 ? 56 : 34} fontFamily={FONT} fontWeight={900} fill="#fff">{b - a === 3 ? t : t === 'ОТДЫХ' ? 'ОТД.' : t}</text>
						</g>
					))}
					{SWAPS.map((s) => (
						<g key={s}>
							<rect x={px(s) - 9} y={150} width={18} height={30} rx={6} fill="#7fe0ff" stroke="#10132a" strokeWidth={4} />
							<text x={px(s)} y={226} textAnchor="middle" fontSize={44} fontFamily={FONT} fontWeight={900} fill="#7fe0ff" stroke="#10132a" strokeWidth={5} paintOrder="stroke">{short(s)}</text>
						</g>
					))}
					<text x={X0} y={32} fontSize={38} fontFamily={FONT} fontWeight={900} fill="#c8d0ea" stroke="#10132a" strokeWidth={5} paintOrder="stroke">23:44</text>
					<text x={X0 + W} y={32} textAnchor="end" fontSize={38} fontFamily={FONT} fontWeight={900} fill="#c8d0ea" stroke="#10132a" strokeWidth={5} paintOrder="stroke">23:55</text>
					{m >= 1424 && m <= 1435 ? <polygon points={`${px(m - 1424) - 20},${36} ${px(m - 1424) + 20},${36} ${px(m - 1424)},${78}`} fill="#fff" stroke="#10132a" strokeWidth={4} /> : null}
				</svg>
			) : null}
			{lbl ? (
				<div style={{position: 'absolute', left: 48, bottom: 44, background: '#11142c', border: '6px solid #7fe0ff', borderRadius: 44, padding: '10px 34px', color: '#7fe0ff', fontFamily: FONT, fontWeight: 900, fontSize: 68}}>{lbl}</div>
			) : null}
		</>
	);
};
const bpmColor = (b: number) => b;
const pads = (p: [number, number][]) => (
	<g>{p.map((q, i) => <rect key={i} x={q[0] - 17} y={q[1] - 28} width={38} height={56} rx={12} fill="#e2483a" stroke="#7a1812" strokeWidth={4} transform={`rotate(-8 ${q[0]} ${q[1]})`} />)}
	</g>
);
const padsWrapped = (p: [number, number][]) => (
	<g>
		{pads(p)}
		{p.map((q, i) => <rect key={i} x={q[0] - 20} y={q[1] - 10} width={44} height={20} rx={6} fill="#7fe0ff" stroke="#10132a" strokeWidth={3} />)}
	</g>
);
const Basin: React.FC<{x: number}> = ({x}) => (
	<g>
		<rect x={x - 54} y={820} width={108} height={80} rx={10} fill="#6e4a2e" stroke="#10132a" strokeWidth={4} />
		<ellipse cx={x} cy={814} rx={78} ry={20} fill="#cfd6e6" stroke="#10132a" strokeWidth={4} />
		<ellipse cx={x} cy={816} rx={64} ry={13} fill="#7fb8e0" />
	</g>
);
const Brother: React.FC<{eyes?: number; towel?: boolean}> = ({eyes = 0, towel = true}) => (
	<g>
		<circle cx={1574} cy={758} r={34} fill="#10132a" stroke="#2a2f63" strokeWidth={3} />
		<path d="M1540,742 q34,-34 68,0" fill="#5a3a22" />
		{towel ? <rect x={1544} y={730} width={60} height={20} rx={6} fill="#ffffff" stroke="#9aa3b5" strokeWidth={2} /> : null}
		<ellipse cx={1565} cy={762} rx={6} ry={Math.max(0.6, 6 * eyes)} fill="#fff" />
		<ellipse cx={1586} cy={762} rx={6} ry={Math.max(0.6, 6 * eyes)} fill="#fff" />
	</g>
);
const TT = 29;
const heroTag = (x: number, s: number, bpm: number, yy: number, ok?: boolean, warn = true) => <HT x={x} s={s} warn={warn && !ok} ok={ok} auto showBpm bpm={bpm} yy={yy} />;
const temaTag = (f: number, x: number, s: number, bpm: number, yy: number, ok?: boolean, warn = true) => <Tag x={x} y={yy} value={TT} f={f} s={s} warn={warn && !ok} ok={ok} auto showBpm bpm={bpm} />;

/* ================= 127–130: тот же кадр, что в хуке ================= */
const S127: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('127');
	const hp = blend(idle(gf, 2), idle(gf, 2), 0);
	const bent = (p: Pose, k: number): Pose => ({...p, lean: p.lean + 40 * k, head: p.head + 22 * k});
	const x = interpolate(e, [0, 70, 130, 196], [1000, 1000, 800, 1090], {...clamp, easing: ease});
	const z = interpolate(e, [0, 70, 130, 196], [1.1, 1.14, 1.5, 1.35], {...clamp, easing: ease});
	const y = interpolate(e, [0, 70, 130, 196], [520, 520, 545, 540], clamp);
	const pose = reach(reach(bent({...hp, lean: hp.lean}, 0.3), 'F', [16, 74], 0.3), 'B', [4, 78], 0.3);
	return (
		<Stage cam={camOn(x, y, z)} bg="#2a3550" light={{x: 20, y: 5, o: 0.35}}>
			<Layer depth={1.6}>
				<Stairwell f={f} open={1} />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<Clock x={600} y={330} text="23:41" s={1.5} blink f={f} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={700} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.8, 0.2]} expr="worried" pose={pose} uid="h127" />
					{heroTag(720, 1, 130, tagY(HS) + 56)}
					<Actor who="tema" x={1290} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.7, 0]} expr="wide" pose={idle(gf, 4)} uid="t127" />
					{temaTag(f, 1290, 1, 90, tagY(1))}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 128 HERO + 129 TEMA + 130 HERO: «Пусти. Мы сделаем их вместе.» — «Ты же дома мог всё сделать.» — «Мог. Пусти, время.» */
const S128: React.FC = () => {
	const {f, gf, at} = useShot();
	const sp = useSpeaking(gf);
	const e = f - at('128');
	const w = walkTo(e, 4, 52, 700, 1130, 1, 0.3);
	const tap = env(f, at('130') + 6, at('130') + 44, 5, 8);
	let hp = w.pose;
	hp = hand(hp, w.x, HS, 1, 'F', [w.x + 70, hip(HS) - 40], tap);
	const cam = sp === 'TEMA' ? camOn(1240, 540, 1.6) : sp === 'HERO' ? camOn(1000, 545, 1.45) : camOn(980, 540, 1.2);
	return (
		<Stage cam={cam} bg="#2a3550" light={{x: 20, y: 5, o: 0.35}}>
			<Layer depth={1.6}>
				<Stairwell f={f} open={1} />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<Clock x={600} y={330} text="23:41" s={1.5} blink f={f} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="hero" x={w.x} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.9, 0]} expr="angry" mouth="open" pose={hp} vx={w.vx} bob={w.bob} uid="h128" />
					<g transform={`translate(${w.x - 52},${hip(HS) - 128 - w.bob})`}>
						<rect width={44} height={86} rx={12} fill="#3a4256" stroke="#10132a" strokeWidth={3} />
						<rect x={8} y={-26} width={14} height={40} rx={6} fill="#e2483a" />
						<rect x={26} y={-30} width={14} height={44} rx={6} fill="#e2483a" />
					</g>
					{heroTag(w.x + 20, 1.1, 130, tagY(HS) - w.bob)}
					<g transform={`translate(${w.x + 90},${hip(HS) - 40})`} opacity={tap > 0.05 ? 1 : 0}>
						<rect x={-20} y={-30} width={40} height={60} rx={8} fill="#10132a" stroke="#7fe0ff" strokeWidth={3} />
						<text y={8} textAnchor="middle" fontSize={16} fontFamily={FONT} fontWeight={800} fill="#ff4a3a">23:42</text>
					</g>
					<Actor who="tema" x={1290} floor={FL} s={1} facing={-1} faceTurn={0.5} look={[-0.8, 0]} expr={sp === 'TEMA' ? 'worried' : 'wide'} pose={gesture('armsCrossed', idle(gf, 4), 0.9, f)} uid="t128" />
					{temaTag(f, 1290, 1.1, 90, tagY(1) - 100)}
				</Svg>
			</Layer>
			<Led text={hms(mins(gf))} />
		</Stage>
	);
};

/* ================= 131–135: подготовка ================= */
const Prep: React.FC<{k: number}> = ({k}) => {
	const rows = ['ЛАПЫ В ПОЛОТЕНЦЕ', 'ТАЗ С ВОДОЙ', 'СТОПКА ПОЛОТЕНЕЦ'];
	return (
		<div style={{position: 'absolute', left: 40, bottom: 190, display: 'flex', gap: 16, alignItems: 'center'}}>
			<div style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#c8d0ea', background: '#11142c', borderRadius: 26, padding: '6px 22px'}}>ПОДГОТОВКА 23:41 → 23:44</div>
			{rows.map((r, i) => (
				<div key={r} style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#fff', background: '#11142c', border: '5px solid #5fe08a', borderRadius: 26, padding: '4px 20px', opacity: k > i * 0.33 ? 1 : 0.15}}>
					<span style={{color: '#5fe08a'}}>✓</span> {r}
				</div>
			))}
		</div>
	);
};
const mkPrep = (variant: 0 | 1 | 2): React.FC => () => {
	const {f, gf, at} = useShot();
	const e = f - at('131') + (variant === 0 ? 0 : variant === 1 ? 75 : 150) - (variant === 0 ? 0 : 0);
	const ee = e;
	const k = interpolate(ee, [10, 190], [0, 1], clamp);
	let hp = idle(gf, 1);
	hp = reach(reach(hp, 'F', [44, -80], 1), 'B', [36, -84], 1);
	const wrap = Math.sin(ee / 4) * 6;
	const cam = variant === 0 ? usePush(camOn(800, 640, 1.5), camOn(840, 650, 1.8)) : variant === 1 ? usePush(camOn(1420, 700, 1.4), camOn(1480, 700, 1.7)) : usePush(camOn(1000, 560, 1.05), camOn(1060, 560, 1.2));
	return (
		<Stage cam={cam} bg="#cdbfa0" light={{x: 40, y: 8, o: 0.35}}>
			<Layer depth={1.6}>
				<Flat f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Brother eyes={0} />
					<Basin x={1420} />
					<Actor who="hero" x={1000} floor={FL} s={HS} facing={-1} faceTurn={0.4} look={[-0.7, 0.4]} expr="normal" pose={hp} uid={'h131' + variant} />
					{padsWrapped([[930, 650 + wrap], [930, 716 + wrap]])}
					<Actor who="tema" x={1250} floor={FL} s={1} facing={-1} faceTurn={0.4} look={[-0.6, 0.6]} expr="normal" pose={reach(idle(gf, 4), 'F', [40, -60], 1)} uid={'t131' + variant} />
					{heroTag(1010, 1.1, 128, tagY(HS) - 90, false, true)}
					{temaTag(f, 1250, 1.1, 90, tagY(1))}
				</Svg>
			</Layer>
			<Hud gf={gf} bar={variant === 2} />
			<Prep k={k} />
		</Stage>
	);
};
const S131a = mkPrep(0);
const S131b = mkPrep(1);
const S131c = mkPrep(2);

/* 132: карточка «ПОКА РАБОТАЕТ ОДИН» */
const S132: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('132');
	const sw = grow(e, 92, 8);
	const hitK = Math.abs(Math.sin(e / 4));
	let hp = guard(idle(gf, 1), 1);
	hp = hit(hp, 'F', 500, 1.5, 1, [700, 680], hitK);
	let tp = idle(gf, 4);
	tp = hand(tp, 1420, 1.5, -1, 'F', [1420 - 160, hip(1.5) - 100], sw);
	return (
		<Board tint="#13213a">
			{sw < 0.5 ? (
				<g>
					<text x={960} y={190} textAnchor="middle" fontSize={96} fontFamily={FONT} fontWeight={900} fill="#ff6a5a">ОСТАНОВИЛСЯ</text>
					<text x={960} y={310} textAnchor="middle" fontSize={96} fontFamily={FONT} fontWeight={900} fill="#ff6a5a">РАУНД СГОРЕЛ ✗</text>
				</g>
			) : (
				<g>
					<text x={960} y={210} textAnchor="middle" fontSize={150} fontFamily={FONT} fontWeight={900} fill="#5fe08a">ПОКА РАБОТАЕТ</text>
					<text x={960} y={370} textAnchor="middle" fontSize={190} fontFamily={FONT} fontWeight={900} fill="#ffd34a">ОДИН</text>
				</g>
			)}
			<rect x={300} y={420} width={1320} height={60} rx={30} fill={sw < 0.5 ? '#e2483a' : '#5fe08a'} opacity={0.9} />
			<text x={960} y={466} textAnchor="middle" fontSize={40} fontFamily={FONT} fontWeight={900} fill="#10132a">{sw < 0.5 ? 'РАУНД ОБОРВАН' : 'РАУНД ИДЁТ'}</text>
			<Actor who="hero" x={500} floor={1060} s={1.5} facing={1} faceTurn={0.4} look={[0.8, 0]} expr="angry" pose={hp} uid="h132" />
			<Actor who="tema" x={1420} floor={1060} s={1.5} facing={-1} faceTurn={0.4} look={[-0.8, 0]} expr="normal" pose={tp} uid="t132" />
			<rect x={1180} y={hip(1.5) + 200 - 40} width={80} height={34} rx={8} fill="#7fe0ff" stroke="#10132a" strokeWidth={4} opacity={sw} />
		</Board>
	);
};

/* 133 HERO + 134 TEMA: «Бьёшь касанием. Тихо. Я меняю полотенце — ты не останавливаешься.» — «А когда меняю я?» */
const S133: React.FC = () => {
	const {f, gf, at} = useShot();
	const sp = useSpeaking(gf);
	const e = f - at('133');
	const nod = env(f, at('134') + 4, at('134') + 30, 5, 6);
	let hp = idle(gf, 1);
	hp = reach(reach(hp, 'F', toLocal(960, 640, 1060, hip(HS), HS, -1), 1), 'B', toLocal(960, 700, 1060, hip(HS), HS, -1), 1);
	let tp = guard(idle(gf, 4), 1);
	tp = hit(tp, e % 30 < 15 ? 'F' : 'B', 840, 1, 1, [955, 650], env(e % 30, 2, 8, 2, 4) * grow(e, 40, 8));
	tp = {...tp, head: tp.head + 14 * nod};
	const cam = sp === 'TEMA' ? camOn(900, 560, 1.6) : camOn(1010, 560, 1.4);
	return (
		<Stage cam={cam} bg="#cdbfa0" light={{x: 40, y: 8, o: 0.35}}>
			<Layer depth={1.6}>
				<Flat f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Brother />
					<Basin x={1420} />
					<Actor who="tema" x={840} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.8, 0]} expr="normal" pose={tp} uid="t133" />
					<Actor who="hero" x={1060} floor={FL} s={HS} facing={-1} faceTurn={0.4} look={[-0.8, 0]} expr="normal" mouth={sp === 'HERO' ? undefined : 'flat'} pose={hp} uid="h133" />
					{pads([[960, 640], [960, 700]])}
					{heroTag(1070, 1.15, 124, tagY(HS) - 90)}
					{temaTag(f, 840, 1.15, 90, tagY(1))}
					<Onoma x={960} y={560} text="тс" t={e - 30} c="#c8d0ea" rot={6} size={50} />
				</Svg>
			</Layer>
			<Led text="23:44" />
		</Stage>
	);
};

/* 135 HERO: «Тогда работаю я. Поехали.» — включает таймер на телефоне: 3:00 */
const S135: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('135');
	const p = hand(idle(gf, 1), 1060, HS, -1, 'F', [1000, hip(HS) - 110], grow(e, 4, 8));
	const cam = usePush(camOn(1020, 560, 1.7), camOn(1000, 540, 2.1));
	return (
		<Stage cam={cam} bg="#cdbfa0" light={{x: 40, y: 8, o: 0.35}}>
			<Layer depth={1.6}>
				<Flat f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Brother />
					<Actor who="hero" x={1060} floor={FL} s={HS} facing={-1} faceTurn={0.5} look={[-0.8, 0.4]} expr="angry" pose={p} uid="h135" />
					<g transform="translate(980,610)">
						<rect x={-34} y={-52} width={68} height={104} rx={12} fill="#10132a" stroke="#7fe0ff" strokeWidth={4} />
						<text y={14} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={900} fill="#7fe0ff">{e > 30 ? '3:00' : '0:00'}</text>
					</g>
					{heroTag(1070, 1.3, 122, tagY(HS) - 20)}
					<Actor who="tema" x={840} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.8, 0]} expr="angry" pose={guard(idle(gf, 4), 1)} uid="t135" />
				</Svg>
			</Layer>
			<Hud gf={gf} bar />
		</Stage>
	);
};

/* ================= 136–142: раунды ================= */
type Mode = 'p1' | 'swapHero' | 'rest' | 'swapTema' | 'rest2' | 'swapHero2' | 'done';
const BEDX = 1560;
const wfrac = (e: number, a: number, b: number) => {
	// 0 — у базовой точки, 1 — у кровати; уходит за 24 кадра, возвращается за 24
	if (e <= a) return 0;
	if (e < a + 24) return (e - a) / 24;
	if (e < b - 24) return 1;
	if (e < b) return (b - e) / 24;
	return 0;
};
const mkRound = (line: string, mode: Mode, win: [number, number], view: 'wide' | 'close' | 'bed', off: number): React.FC => () => {
	const {f, gf, at} = useShot();
	const e = f - at(line); // кадров от начала реплики
	const m = mins(gf);
	const t = m - 1424;
	const inRound = SEGS.some(([a, b, , n]) => n !== 'ОТДЫХ' && t >= a && t < b);
	const bpm = inRound ? interpolate(e, [-20, 25], [112, 150], clamp) : interpolate(e, [0, 60], [150, 98], clamp);
	const sw = wfrac(e, win[0], win[1]);
	const heroWorks = mode === 'swapTema' || mode === 'rest2';
	const wX = 840 + Math.sin(e / 7) * (heroWorks ? 30 : 0);
	const fX = 1060;
	// кто и куда идёт
	const swapperIsHero = mode === 'swapHero' || mode === 'swapHero2' || mode === 'rest2';
	const swapperIsTema = mode === 'swapTema' || mode === 'rest';
	let heroX = heroWorks ? wX : fX;
	let temaX = heroWorks ? fX : wX;
	if (swapperIsHero) heroX = fX + (BEDX - 80 - fX) * sw;
	if (swapperIsTema) temaX = fX + (BEDX - 80 - fX) * sw;
	if (mode === 'rest' || mode === 'rest2') {
		// отдых: тот, кто не идёт к кровати, стоит
	}
	const walkingH = swapperIsHero && sw > 0.02 && sw < 0.98;
	const walkingT = swapperIsTema && sw > 0.02 && sw < 0.98;
	const wph = e / 3.2;
	let hp: Pose = heroWorks ? guard(idle(gf, 1), inRound ? 1 : 0) : idle(gf, 1);
	let tp: Pose = !heroWorks ? guard(idle(gf, 4), inRound ? 1 : 0) : idle(gf, 4);
	// работник: касания по лапам (Тёма) или нырок-шаг-нырок (герой с пустыми лапами)
	if (inRound && !heroWorks) {
		const tgt: [number, number] = [fX - 100, 650];
		for (let i = 0; i < 3; i++) {
			const ph = (e + i * 6) % 18;
			tp = hit(tp, i % 2 ? 'B' : 'F', temaX, 1, 1, [swapperIsHero && sw > 0.3 ? 960 : tgt[0], tgt[1] + (i % 3) * 20], env(ph, 3, 9, 2, 4) * (i === Math.floor(((e + 18) % 54) / 18) ? 1 : 0));
		}
	}
	if (inRound && heroWorks) {
		const dip = Math.max(0, Math.sin(e / 6));
		hp = {...hp, lean: hp.lean + 26 * dip, head: hp.head + 10 * dip};
	}
	if (walkingH) hp = {...walk(wph), lean: 8};
	if (walkingT) tp = {...walk(wph), lean: 8};
	// у кровати — полотенце
	const atBedH = swapperIsHero && sw > 0.98;
	const atBedT = swapperIsTema && sw > 0.98;
	if (atBedH) hp = reach(hp, 'F', toLocal(BEDX - 20, 770, heroX, hip(HS), HS, 1), 1);
	if (atBedT) tp = reach(tp, 'F', toLocal(BEDX - 20, 770, temaX, hip(1), 1, 1), 1);
	const eyes = line === '141' ? grow(e, 70, 14) : 0;
	const hf = heroWorks ? (walkingT || atBedT ? 1 : 1) : 1;
	const camT = view === 'wide' ? usePush(camOn(1080, 560, 1.05), camOn(1100, 560, 1.22)) : view === 'bed' ? usePush(camOn(1450, 640, 1.5), camOn(1500, 650, 1.8)) : usePush(camOn(1000, 470, 1.55), camOn(960, 470, 1.75));
	const cam = camT;
	const facingH: 1 | -1 = swapperIsHero && sw > 0.02 ? 1 : heroWorks ? 1 : -1;
	const facingT: 1 | -1 = swapperIsTema && sw > 0.02 ? 1 : heroWorks ? -1 : 1;
	const hh = heroWorks ? [heroX + 40, 650] : [heroX - 100, 650];
	return (
		<Stage cam={cam} bg="#cdbfa0" light={{x: 40, y: 8, o: 0.35}}>
			<Layer depth={1.6}>
				<Flat f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Brother eyes={eyes} />
					<Basin x={1420} />
					<Actor who="tema" x={temaX} floor={FL} s={1} facing={facingT} faceTurn={0.4} look={[facingT * 0.7, 0.1]} expr={inRound ? 'angry' : 'normal'} mouth={inRound ? 'flat' : 'open'} pose={tp} vx={walkingT ? 4 : 0} uid={'t' + line + view} />
					<Actor who="hero" x={heroX} floor={FL} s={HS} facing={facingH} faceTurn={0.4} look={[facingH * 0.7, 0.1]} expr={inRound ? 'angry' : 'normal'} mouth={inRound ? 'flat' : 'open'} pose={hp} vx={walkingH ? 4 : 0} uid={'h' + line + view} />
					{!heroWorks ? pads([[heroX - 100 + (sw > 0.3 && swapperIsHero ? 60 : 0), 650 - (walkingH ? 20 : 0)], [heroX - 100 + (sw > 0.3 && swapperIsHero ? 60 : 0), 716]]) : pads([[heroX + 90, 640], [heroX + 90, 700]])}
					{(atBedH || atBedT) ? <rect x={BEDX - 50} y={740} width={64} height={26} rx={7} fill="#7fe0ff" stroke="#10132a" strokeWidth={3} /> : null}
					{heroTag(heroX + 10, 1.15, bpm, tagY(HS) - 90 - (walkingH ? Math.abs(Math.sin(wph)) * 8 : 0), e > 9999)}
					{temaTag(f, temaX, 1.15, bpm, tagY(1) - (walkingT ? Math.abs(Math.sin(wph)) * 8 : 0))}
					{atBedH || atBedT ? pill(1235, 640, 'ПОЛОТЕНЦЕ', '#7fe0ff', 1, 50) : null}
				</Svg>
			</Layer>
			<Hud gf={gf} bar />
		</Stage>
	);
};
const S136a = mkRound('136', 'p1', [999, 999], 'wide', 0);
const S136b = mkRound('136', 'p1', [999, 999], 'close', 0);
const S137a = mkRound('137', 'swapHero', [30, 200], 'wide', 0);
const S137b = mkRound('137', 'swapHero', [30, 200], 'bed', 0);
const S138a = mkRound('138', 'rest', [90, 190], 'wide', 0);
const S138b = mkRound('138', 'rest', [90, 190], 'bed', 0);
const S139a = mkRound('139', 'swapTema', [110, 220], 'close', 0);
const S139b = mkRound('139', 'swapTema', [110, 220], 'wide', 0);
const S140a = mkRound('140', 'rest2', [90, 190], 'wide', 0);
const S140b = mkRound('140', 'rest2', [90, 190], 'bed', 0);
const S141a = mkRound('141', 'swapHero2', [14, 150], 'bed', 0);
const S141b = mkRound('141', 'swapHero2', [14, 150], 'wide', 0);

/* 142: 23:55, таймер 0:00 — оба сползают по стене, сердца красные */
const S142: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('142');
	const slide = grow(e, 30, 30);
	const seat = interpolate(slide, [0, 1], [hip(HS), FL - 34]);
	const seatT = interpolate(slide, [0, 1], [hip(1), FL - 34]);
	const ph = blend(idle(gf, 1), FS, slide);
	const pt = blend(idle(gf, 4), FS, slide);
	const cam = usePush(camOn(1000, 560, 1.15), camOn(980, 640, 1.45));
	return (
		<Stage cam={cam} bg="#cdbfa0" light={{x: 40, y: 8, o: 0.35}}>
			<Layer depth={1.6}>
				<Flat f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Brother eyes={0.6} />
					{shadow(840, 1 + slide)}
					{shadow(1060, 1 + slide)}
					<Actor who="tema" x={840} floor={FL} seat={seatT} s={1} facing={1} faceTurn={0.4} look={[0.6, 0.2]} expr="sleepy" mouth="open" pose={pt} uid="t142" />
					<Actor who="hero" x={1060} floor={FL} seat={seat} s={HS} facing={-1} faceTurn={0.4} look={[-0.6, 0.2]} expr="sleepy" mouth="open" pose={ph} uid="h142" />
					{heroTag(1070, 1.3, 150, seat - 164 * HS - 215)}
					{temaTag(f, 840, 1.3, 150, seatT - 164 - 125)}
					<g transform="translate(960,330)">
						<rect x={-150} y={-70} width={300} height={130} rx={20} fill="#10141f" stroke="#7fe0ff" strokeWidth={6} />
						<text y={34} textAnchor="middle" fontSize={100} fontFamily={FONT} fontWeight={900} fill="#7fe0ff">0:00</text>
					</g>
				</Svg>
			</Layer>
			<Hud gf={gf} bar big />
		</Stage>
	);
};

/* 143: в дверях стоит брат с полотенцем на лбу; облачко «А мне можно?» (без голоса) */
const S143: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('143');
	const cam = usePush(camOn(1200, 600, 1.2), camOn(1260, 610, 1.35));
	return (
		<Stage cam={cam} bg="#cdbfa0" light={{x: 40, y: 8, o: 0.35}}>
			<Layer depth={1.6}>
				<Flat f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="bro" x={1640} floor={FL} s={0.7} facing={-1} faceTurn={0.4} look={[-0.8, 0.2]} expr="sad" pose={idle(gf, 7)} uid="b143" />
					<rect x={1612} y={FL - 157 * 0.7 - 164 * 0.7 + 6} width={56} height={18} rx={6} fill="#ffffff" stroke="#9aa3b5" strokeWidth={2} />
					<Actor who="tema" x={840} floor={FL} seat={FL - 34} s={1} facing={1} faceTurn={0.4} look={[0.8, 0.2]} expr="sleepy" pose={FS} uid="t143" />
					<Actor who="hero" x={1060} floor={FL} seat={FL - 34} s={HS} facing={-1} faceTurn={0.4} look={[0.4, 0.2]} expr="sleepy" pose={FS} uid="h143" />
					<Bubble x={1480} y={370} w={560} h={140} t={Math.max(0, e - 10)} tail={[150, 130]}>
						<text x={0} y={24} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#10132a">А мне можно?</text>
					</Bubble>
					{heroTag(1070, 1.2, 130, FL - 34 - 164 * HS - 215)}
					{temaTag(f, 840, 1.2, 130, FL - 34 - 164 - 125)}
				</Svg>
			</Layer>
			<Led text="23:55" />
		</Stage>
	);
};

/* 144 TEMA: «Когда поправишься. Обещаю.» — улыбается, поправляет брату полотенце */
const S144: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('144');
	const up = grow(e, 4, 14);
	const tx = interpolate(up, [0, 1], [840, 1500], clamp);
	const seat = interpolate(up, [0, 1], [FL - 34, hip(1)]);
	let tp = blend(FS, idle(gf, 4), up);
	tp = reach(tp, 'F', toLocal(1625, 760, tx, hip(1), 1, 1), grow(e, 30, 10));
	const cam = usePush(camOn(1350, 600, 1.4), camOn(1500, 620, 1.8));
	return (
		<Stage cam={cam} bg="#cdbfa0" light={{x: 40, y: 8, o: 0.35}}>
			<Layer depth={1.6}>
				<Flat f={f} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="bro" x={1640} floor={FL} s={0.7} facing={-1} faceTurn={0.4} look={[-0.8, 0.2]} expr="normal" mouth="smile" pose={idle(gf, 7)} uid="b144" />
					<rect x={1612} y={FL - 157 * 0.7 - 164 * 0.7 + 6} width={56} height={18} rx={6} fill="#ffffff" stroke="#9aa3b5" strokeWidth={2} />
					<Actor who="tema" x={tx} floor={FL} seat={up < 1 ? seat : undefined} s={1} facing={1} faceTurn={0.5} look={[0.9, 0.1]} expr="normal" mouth="smile" pose={tp} uid="t144" />
					{temaTag(f, tx, 1.2, 120, tagY(1) - 4)}
				</Svg>
			</Layer>
			<Led text="23:55" />
		</Stage>
	);
};

/* 145: 00:00 — «29» над обоими перестаёт мигать, искры */
const S145: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('145');
	const ok = e > 70;
	const ring = Math.max(0, 1 - (e - 70) / 26);
	const sparks = (x: number, y: number) => Array.from({length: 14}).map((_, i) => {
		const a = (i / 14) * Math.PI * 2;
		const d = Math.max(0, e - 70) * 5;
		return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d * 0.7} r={Math.max(0, 7 - (e - 70) / 5)} fill="#ffe08a" opacity={e > 70 && e < 100 ? 1 : 0} />;
	});
	const cam = usePush(camOn(960, 560, 1.15), camOn(960, 540, 1.35));
	return (
		<Stage cam={cam} bg="#cdbfa0" light={{x: 40, y: 8, o: 0.35}}>
			<Layer depth={1.6}>
				<Flat f={f} />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<Clock x={960} y={190} text="00:00" s={1.8} f={f} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					{shadow(840, 2)}
					{shadow(1060, 2)}
					<Actor who="tema" x={840} floor={FL} seat={FL - 34} s={1} facing={1} faceTurn={0.4} look={[0.6, 0.2]} expr="sleepy" mouth="smile" pose={FS} uid="t145" />
					<Actor who="hero" x={1060} floor={FL} seat={FL - 34} s={HS} facing={-1} faceTurn={0.4} look={[-0.6, 0.2]} expr="sleepy" mouth="smile" pose={FS} uid="h145" />
					{heroTag(1070, 1.5, 110, FL - 34 - 164 * HS - 225, ok, !ok)}
					{temaTag(f, 840, 1.5, 110, FL - 34 - 164 - 125, ok, !ok)}
					{ok ? [[840, FL - 34 - 164 - 125], [1070, FL - 34 - 164 * HS - 225]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={60 + (e - 70) * 8} fill="none" stroke="#5fe08a" strokeWidth={8 * ring} opacity={ring} />) : null}
					{ok ? sparks(840, FL - 34 - 164 - 125) : null}
					{ok ? sparks(1070, FL - 34 - 164 * HS - 225) : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 146 + 147: «Назавтра — тридцать»: доска «САНЯ 30», «ТЁМА 30»; тренер: «Оба. В группу.» */
const S146: React.FC = () => {
	const {f, gf, at} = useShot();
	const e = f - at('146');
	const knock = env(f, at('147') + 4, at('147') + 30, 4, 6);
	let tp = idle(gf, 3);
	tp = reach(tp, 'F', [60, -190 + Math.sin(f / 3) * 14 * (grow(e, 6, 10) * (1 - grow(e, 70, 6)) + knock)], 1);
	const cam = usePush(camOn(980, 520, 1.2), camOn(1060, 500, 1.4));
	return (
		<Stage cam={cam} bg="#25324a" light={{x: 20, y: 10, o: 0.4}}>
			<Layer depth={1.6}>
				<Gym f={f} />
			</Layer>
			<Layer depth={1.3}>
				<Svg>
					<rect x={1180} y={200} width={640} height={440} rx={10} fill="#6e4a2e" />
					<rect x={1196} y={216} width={608} height={408} rx={6} fill="#27413a" />
					<Chalk x={1230} y={360} text="САНЯ 30" k={grow(e, 6, 30)} size={110} />
					<Chalk x={1230} y={520} text="ТЁМА 30" k={grow(e, 40, 30)} size={110} c="#ff8a7a" />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Actor who="trainer" x={1060} floor={FL} s={1.02} facing={1} faceTurn={0.6} look={[0.9, -0.3]} mouth={f > at('147') ? 'open' : undefined} pose={tp} uid="t146" />
					<Actor who="hero" x={820} floor={FL} s={HS} facing={1} faceTurn={0.4} look={[0.9, 0]} expr="normal" mouth="smile" pose={idle(gf, 1)} uid="h146" />
					<HT x={830} s={1.2} auto bpm={78} yy={tagY(HS) - 80} />
					<Actor who="tema" x={560} floor={FL} s={1} facing={1} faceTurn={0.4} look={[0.9, 0]} expr="normal" mouth="smile" pose={idle(gf, 4)} uid="t146b" />
					<Tag x={560} y={tagY(1)} value={counterAt(gf)} f={f} s={1.2} bpm={78} />
					<Onoma x={1190} y={680} text="ТУК" t={f - (at('147') + 14)} c="#fff" rot={-6} size={50} />
				</Svg>
			</Layer>
		</Stage>
	);
};

export const PART9: ShotDef[] = [
	{at: '127', C: S127, whip: true},
	{at: '128', C: S128},
	{at: '131', C: S131a, whip: true},
	{at: '131', off: 75, C: S131b},
	{at: '131', off: 150, C: S131c},
	{at: '132', C: S132, own: true, ownCuts: []},
	{at: '133', C: S133, whip: true},
	{at: '135', C: S135},
	{at: '136', C: S136a},
	{at: '136', off: 100, C: S136b},
	{at: '137', C: S137a},
	{at: '137', off: 110, C: S137b},
	{at: '138', C: S138a},
	{at: '138', off: 100, C: S138b},
	{at: '139', C: S139a},
	{at: '139', off: 120, C: S139b},
	{at: '140', C: S140a},
	{at: '140', off: 120, C: S140b},
	{at: '141', C: S141a},
	{at: '141', off: 90, C: S141b},
	{at: '142', C: S142},
	{at: '143', C: S143},
	{at: '144', C: S144},
	{at: '145', C: S145},
	{at: '146', C: S146, whip: true},
];
