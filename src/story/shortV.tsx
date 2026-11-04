import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Pose, toLocal} from '../engine/Stickman';
import {blend, idle, reach} from '../kit/actions';
import {Actor} from '../kit/core';
import {clamp} from '../kit/kit';
import {FONT} from '../kit/ui';
import {Flat, Tag} from './places';
import {grow} from './common';
import {hms, mins, roundNow} from './shots7';

/* Вертикальные (1080×1920) части шортса. Текст — в верхней половине, числа и плашки крупно, ничего не режется краями. */
const Bg: React.FC<{c: string; f?: number; dur?: number; children: React.ReactNode}> = ({c, f = 0, dur = 1, children}) => {
	const z = 1 + 0.05 * Math.min(1, f / Math.max(1, dur)); // медленный наезд: карточка не стоит
	return (
		<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, ${c} 0%, #0a0514 80%)`, overflow: 'hidden'}}>
			<svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{transform: `scale(${z})`, transformOrigin: '50% 40%'}}>
				{Array.from({length: 42}).map((_, i) => <line key={i} x1={0} y1={i * 46} x2={1080} y2={i * 46} stroke="#fff" opacity={0.03} />)}
				{children}
			</svg>
		</AbsoluteFill>
	);
};

/* крупные часы вверху (hook — 23:41, p9 — время сцены части 9) и один таймер раунда под ними; label — своя строка вместо таймера */
export const TopClock: React.FC<{mode: 'hook' | 'p9'; f: number; ep0: number; label?: string}> = ({mode, f, ep0, label}) => {
	const colon = Math.floor(f / 15) % 2 === 0;
	const m = mins(ep0 + f);
	const text = mode === 'hook' ? '23:41' : hms(m, Math.abs(m - 1427.5) < 0.12 || Math.abs(m - 1431.5) < 0.12);
	const lbl = label ?? (mode === 'p9' ? roundNow(m) : null);
	return (
		<>
			{mode === 'p9' ? <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 470, background: 'linear-gradient(#0a0514 0%, #0a0514 80%, rgba(10,5,20,0) 100%)'}} /> : null}
			<div style={{position: 'absolute', left: '50%', top: 40, transform: 'translateX(-50%)', background: '#10141f', border: '8px solid #2c3646', borderRadius: 26, padding: '4px 36px', color: '#ff4a3a', fontFamily: FONT, fontWeight: 800, fontSize: 150, lineHeight: 1.1, textShadow: '0 0 22px #ff4a3a', whiteSpace: 'nowrap'}}>
				{mode === 'hook' && !colon ? text.replace(':', ' ') : text}
			</div>
			{lbl ? <div style={{position: 'absolute', left: '50%', top: 270, transform: 'translateX(-50%)', background: '#11142c', border: '7px solid #7fe0ff', borderRadius: 50, padding: '6px 34px', color: '#7fe0ff', fontFamily: FONT, fontWeight: 900, fontSize: lbl.length > 20 ? 62 : 80, whiteSpace: 'nowrap'}}>{lbl}</div> : null}
		</>
	);
};

/* 005 (лонг 006): вопрос рассказчика словами, табличка «29» трескается в «0» и собирается обратно */
const TITLE: [string, number][][] = [
	[['ЧТО', 0], ['ЕСЛИ', 7], ['БЫ', 16]],
	[['НАД', 24], ['ТОБОЙ', 31], ['ВИСЕЛ', 42]],
	[['СЧЁТЧИК', 52], ['ДНЕЙ,', 65]],
	[['КОТОРЫЙ', 80], ['СГОРАЕТ', 92]],
	[['ЗА', 106], ['ОДИН', 111], ['ПРОПУСК?', 119]],
];
export const TitleCard: React.FC<{f: number; dur: number}> = ({f, dur}) => {
	const crack = grow(f, 94, 3);
	const mend = grow(f, 128, 14);
	const broken = crack > 0 && mend < 1;
	const shake = broken ? crack * (1 - mend) * Math.sin(f * 2.1) * 10 : 0;
	const pop = 1 + 0.12 * Math.exp(-Math.max(0, f - 94) / 5) * crack;
	return (
		<Bg c="#241638" f={f} dur={dur}>
			{TITLE.map((line, li) => (
				<text key={li} x={540} y={260 + li * 130 + Math.sin(f / 18 + li) * 3} textAnchor="middle" fontSize={98} fontFamily={FONT} fontWeight={900} fill={li === 4 ? '#ffc94a' : '#fff'}>
					{line.map(([w, t], i) => (
						<tspan key={i} fillOpacity={interpolate(f, [t, t + 6], [0, 1], clamp)}>
							{w}
							{i < line.length - 1 ? ' ' : ''}
						</tspan>
					))}
				</text>
			))}
			<g transform={`translate(${shake},${1330 + Math.sin(f / 12) * 8})`}>
				<Tag x={450} y={0} value={broken && crack > 0 && mend < 0.5 ? 0 : 29} f={f} s={3.7 * pop} warn bpm={0} heart={false} />
				{crack > 0 && mend < 0.5 ? (
					<g stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" opacity={1 - mend * 2}>
						<path d="M330,-100 L390,-20 L340,40 L420,130" />
						<path d="M600,-130 L560,-40 L640,20 L580,110" />
					</g>
				) : null}
			</g>
		</Bg>
	);
};

/* 006 (лонг 132): «ОСТАНОВИЛСЯ — РАУНД СГОРЕЛ» → «ПОКА РАБОТАЕТ ОДИН» + почему полотенце */
export const RuleCard: React.FC<{f: number; dur: number}> = ({f, dur}) => {
	const sw = grow(f, 92, 8);
	const hitK = Math.abs(Math.sin(f / 4));
	let hp: Pose = idle(f, 1);
	hp = reach(reach(hp, 'F', [44, -128], 1), 'B', [30, -106], 1);
	hp = reach(hp, 'F', [150 * hitK + 20, -120], hitK);
	let tp: Pose = idle(f, 4);
	tp = reach(tp, 'F', [60, -60], sw);
	const bob = Math.sin(f / 9) * 6;
	return (
		<Bg c={sw < 0.5 ? '#3a1020' : '#103a20'} f={f} dur={dur}>
			{sw < 0.5 ? (
				<g>
					<text x={540} y={300} textAnchor="middle" fontSize={112} fontFamily={FONT} fontWeight={900} fill="#ff6a5a">ОСТАНОВИЛСЯ</text>
					<text x={540} y={450} textAnchor="middle" fontSize={140} fontFamily={FONT} fontWeight={900} fill="#ff6a5a">РАУНД</text>
					<text x={540} y={610} textAnchor="middle" fontSize={140} fontFamily={FONT} fontWeight={900} fill="#ff6a5a">СГОРЕЛ ✗</text>
				</g>
			) : (
				<g>
					<text x={540} y={290} textAnchor="middle" fontSize={124} fontFamily={FONT} fontWeight={900} fill="#5fe08a">ПОКА</text>
					<text x={540} y={430} textAnchor="middle" fontSize={124} fontFamily={FONT} fontWeight={900} fill="#5fe08a">РАБОТАЕТ</text>
					<text x={540} y={620} textAnchor="middle" fontSize={190} fontFamily={FONT} fontWeight={900} fill="#ffd34a">ОДИН</text>
				</g>
			)}
			<rect x={120} y={690} width={840} height={70} rx={35} fill={sw < 0.5 ? '#e2483a' : '#5fe08a'} />
			<text x={540} y={742} textAnchor="middle" fontSize={46} fontFamily={FONT} fontWeight={900} fill="#10132a">{sw < 0.5 ? 'РАУНД ОБОРВАН' : 'РАУНД ИДЁТ'}</text>
			<g opacity={grow(f, 108, 14)}>
				<text x={540} y={850} textAnchor="middle" fontSize={54} fontFamily={FONT} fontWeight={800} fill="#bfeaff">БРАТ БОЛЕН:</text>
				<text x={540} y={930} textAnchor="middle" fontSize={48} fontFamily={FONT} fontWeight={800} fill="#bfeaff">ПОЛОТЕНЦЕ КАЖДЫЕ 2 МИНУТЫ</text>
			</g>
			<Actor who="hero" x={270} floor={1840 + bob} s={2.2} facing={1} faceTurn={0.4} look={[0.8, 0]} expr="angry" pose={hp} uid="hv1" />
			<Actor who="tema" x={810} floor={1840 + bob} s={2.2} facing={-1} faceTurn={0.4} look={[-0.8, 0]} expr="normal" pose={tp} uid="tv1" />
			<rect x={470} y={1840 - 157 * 2.2 + 120} width={110} height={46} rx={10} fill="#7fe0ff" stroke="#10132a" strokeWidth={5} opacity={sw} />
		</Bg>
	);
};

/* кульминация целиком: оба героя и их плашки полностью в кадре (канон: 1080×1920, пол на y=1760, масштаб 2) */
const CF = 1760;
const CS = 2;
const HIP = CF - 157 * CS;
const toward = (p: Pose, side: 'F' | 'B', x: number, facing: 1 | -1, t: [number, number], k: number) => reach(p, side, toLocal(t[0], t[1], x, HIP, CS, facing), k);
export const Climax: React.FC<{f: number; dur: number; line: '133' | '136' | '142' | '145'}> = ({f, dur, line}) => {
	const sit = line === '142' ? grow(f, 30, 30) : line === '145' ? 1 : 0;
	const working = line === '133' || line === '136';
	const seatT = interpolate(sit, [0, 1], [HIP, CF - 34 * CS]);
	const heroX = 800;
	const temaX = 270;
	// пульс: 133 — герой жёлтый, Тёма серый; 136 — оба растут до красных 150; 142–145 — красное, потом падает
	const bpmH = line === '133' ? 124 : line === '136' ? interpolate(f, [0, 60], [112, 150], clamp) : line === '142' ? 150 : interpolate(f, [60, 130], [150, 110], clamp);
	const bpmT = line === '133' ? 90 : bpmH;
	const ok = line === '145' && f > 66;
	const warn = !ok;
	let tp: Pose = idle(f, 4);
	let hp: Pose = idle(f, 1);
	if (working) {
		const run = line === '136' ? 1 : grow(f, 40, 10);
		tp = toward(tp, 'F', temaX, 1, [530, 1490], 0.6);
		tp = toward(tp, 'B', temaX, 1, [520, 1560], 0.6);
		for (let i = 0; i < 12; i++) {
			const st = 8 + i * 15;
			const k = Math.max(0, 1 - Math.abs(((f - st) % 180) - 4) / 6);
			tp = toward(tp, i % 2 ? 'B' : 'F', temaX, 1, [545, 1500 + (i % 3) * 30], k * run);
		}
		hp = toward(toward(hp, 'F', heroX, -1, [545, 1490], 1), 'B', heroX, -1, [545, 1565], 1);
	} else {
		tp = blend(idle(f, 4), {lean: -4, head: 0, armB: [20, 40], armF: [30, 40], legB: [90, 0], legF: [92, 0]}, sit);
		hp = blend(idle(f, 1), {lean: -4, head: 0, armB: [20, 40], armF: [30, 40], legB: [90, 0], legF: [92, 0]}, sit);
	}
	const headY = (seat: number) => seat - 164 * CS;
	const tagYT = headY(seatT) - 250;
	const tagYH = tagYT - 120;
	const bob = Math.sin(f / 10) * 5;
	const S = 1.78;
	return (
		<AbsoluteFill style={{background: '#0a0514', overflow: 'hidden'}}>
			<div style={{position: 'absolute', width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${540 - 1300 * S}px, ${CF - 900 * S}px) scale(${S * (1 + 0.04 * (f / Math.max(1, dur)))})`}}>
				<Flat f={f} />
			</div>
			<svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
				<ellipse cx={temaX} cy={CF + 8} rx={150 + 40 * sit} ry={20} fill="#000" opacity={0.25} />
				<ellipse cx={heroX} cy={CF + 8} rx={150 + 40 * sit} ry={20} fill="#000" opacity={0.25} />
				<Actor who="tema" x={temaX} floor={CF} seat={sit > 0.02 ? seatT : undefined} s={CS} facing={1} faceTurn={0.4} look={[0.7, 0.2]} expr={line === '145' ? 'sleepy' : working ? 'angry' : 'sleepy'} mouth={line === '145' ? 'smile' : 'open'} pose={tp} bob={working ? bob * 0.5 : 0} shadow={false} uid={'tc' + line} />
				<Actor who="hero" x={heroX} floor={CF} seat={sit > 0.02 ? seatT : undefined} s={CS} facing={-1} faceTurn={0.4} look={[-0.7, 0.2]} expr={line === '145' ? 'sleepy' : working ? 'angry' : 'sleepy'} mouth={line === '145' ? 'smile' : 'open'} pose={hp} bob={working ? bob * 0.5 : 0} shadow={false} uid={'hc' + line} />
				{working ? (
					<g>
						{[1490, 1565].map((y) => <rect key={y} x={530} y={y - 30} width={42} height={62} rx={12} fill="#e2483a" stroke="#7a1812" strokeWidth={4} transform={`rotate(-8 545 ${y})`} />)}
					</g>
				) : null}
				<Tag x={temaX - 10} y={tagYT} value={29} f={f} s={1.45} warn={warn} ok={ok} auto showBpm bpm={bpmT} />
				<Tag x={heroX - 190} y={tagYH} value={29} f={f} s={1.45} warn={warn} ok={ok} auto showBpm bpm={bpmH} />
				{ok ? [[temaX - 10, tagYT], [heroX - 190, tagYH]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={60 + (f - 66) * 9} fill="none" stroke="#5fe08a" strokeWidth={9 * Math.max(0, 1 - (f - 66) / 24)} opacity={Math.max(0, 1 - (f - 66) / 24)} />) : null}
			</svg>
		</AbsoluteFill>
	);
};
export const C133: React.FC<{f: number; dur: number}> = (p) => <Climax {...p} line="133" />;
export const C136: React.FC<{f: number; dur: number}> = (p) => <Climax {...p} line="136" />;
export const C142: React.FC<{f: number; dur: number}> = (p) => <Climax {...p} line="142" />;
export const C145: React.FC<{f: number; dur: number}> = (p) => <Climax {...p} line="145" />;

/* 011 (лонг 174): вопрос сверху, ниже календарь «ТУРНИР», строка про канал и герои */
export const FinalCard: React.FC<{f: number; dur: number}> = ({f, dur}) => {
	const out = interpolate(f, [dur - 24, dur], [0, 1], clamp);
	const pulse = 0.6 + 0.4 * Math.sin(f / 7);
	const bob = Math.sin(f / 11) * 5;
	return (
		<Bg c="#101626" f={f} dur={dur}>
			<text x={540} y={250} textAnchor="middle" fontSize={96} fontFamily={FONT} fontWeight={900} fill="#fff" opacity={grow(f, 6, 14)}>А ЧТО ТЫ БРОСИЛ</text>
			<text x={540} y={380} textAnchor="middle" fontSize={96} fontFamily={FONT} fontWeight={900} fill="#ffc94a" opacity={grow(f, 30, 14)}>ПОСЛЕ ПЕРВОГО</text>
			<text x={540} y={510} textAnchor="middle" fontSize={96} fontFamily={FONT} fontWeight={900} fill="#ffc94a" opacity={grow(f, 50, 14)}>ПРОПУСКА?</text>
			<g opacity={grow(f, 40, 16)} transform="translate(20,590) scale(1.06)">
				{Array.from({length: 35}).map((_, i) => {
					const c = i % 7;
					const r = Math.floor(i / 7);
					const hot = i === 17;
					return (
						<g key={i}>
							<rect x={c * 146} y={r * 100} width={138} height={92} rx={12} fill={hot ? '#e2483a' : '#1b2350'} opacity={hot ? 0.55 + 0.45 * pulse : 1} stroke={hot ? '#ffd34a' : '#2f3a6a'} strokeWidth={hot ? 6 : 3} />
							<text x={c * 146 + 14} y={r * 100 + 38} fontSize={34} fontFamily={FONT} fontWeight={700} fill={hot ? '#fff' : '#8f98bd'}>{i + 1}</text>
						</g>
					);
				})}
				<text x={3 * 146 + 69} y={2 * 100 + 78} textAnchor="middle" fontSize={36} fontFamily={FONT} fontWeight={900} fill="#fff">ТУРНИР</text>
			</g>
			<text x={540} y={1190} textAnchor="middle" fontSize={60} fontFamily={FONT} fontWeight={900} fill="#7fe0ff" opacity={grow(f, 44, 12)}>Полная история — на канале</text>
			<Actor who="hero" x={310} floor={1900 + bob} s={1.7} facing={1} faceTurn={0.4} look={[0.6, -0.2]} expr="normal" mouth="smile" pose={idle(f, 1)} uid="hf1" />
			<Actor who="tema" x={770} floor={1900 + bob} s={1.7} facing={-1} faceTurn={0.4} look={[-0.6, -0.2]} expr="normal" mouth="smile" pose={idle(f, 4)} uid="tf1" />
			<rect x={0} y={0} width={1080} height={1920} fill="#02030a" opacity={out} />
		</Bg>
	);
};
