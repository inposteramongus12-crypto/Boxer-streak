import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Pose} from '../engine/Stickman';
import {env, idle, reach} from '../kit/actions';
import {Actor} from '../kit/core';
import {clamp, ease} from '../kit/kit';
import {FONT} from '../kit/ui';
import {Tag} from './places';
import {grow} from './common';
import {hms, mins, roundNow} from './shots7';

/* Вертикальные (1080×1920) части шортса. Текст — в верхней половине, числа и плашки крупно. */
const Bg: React.FC<{c: string; children: React.ReactNode}> = ({c, children}) => (
	<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, ${c} 0%, #0a0514 80%)`}}>
		<svg viewBox="0 0 1080 1920" width={1080} height={1920}>
			{Array.from({length: 42}).map((_, i) => <line key={i} x1={0} y1={i * 46} x2={1080} y2={i * 46} stroke="#fff" opacity={0.03} />)}
			{children}
		</svg>
	</AbsoluteFill>
);

/* крупные часы вверху: «hook» — 23:41 (красные светодиоды, как в хуке), «p9» — время сцены части 9 */
export const TopClock: React.FC<{mode: 'hook' | 'p9'; f: number; ep0: number}> = ({mode, f, ep0}) => {
	const colon = Math.floor(f / 15) % 2 === 0;
	const m = mins(ep0 + f);
	const text = mode === 'hook' ? '23:41' : hms(m, Math.abs(m - 1427.5) < 0.12 || Math.abs(m - 1431.5) < 0.12);
	const lbl = mode === 'p9' ? roundNow(m) : null;
	return (
		<>
			{mode === 'p9' ? <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 450, background: 'linear-gradient(#0a0514 0%, #0a0514 78%, rgba(10,5,20,0) 100%)'}} /> : null}
			<div style={{position: 'absolute', left: '50%', top: mode === 'hook' ? 24 : 50, transform: 'translateX(-50%)', background: '#10141f', border: '8px solid #2c3646', borderRadius: 26, padding: '6px 40px', color: '#ff4a3a', fontFamily: FONT, fontWeight: 800, fontSize: mode === 'hook' ? 120 : 170, lineHeight: 1.1, textShadow: '0 0 22px #ff4a3a', whiteSpace: 'nowrap'}}>
				{mode === 'hook' && !colon ? text.replace(':', ' ') : text}
			</div>
			{lbl ? <div style={{position: 'absolute', left: '50%', top: 300, transform: 'translateX(-50%)', background: '#11142c', border: '7px solid #7fe0ff', borderRadius: 50, padding: '6px 40px', color: '#7fe0ff', fontFamily: FONT, fontWeight: 900, fontSize: 84, whiteSpace: 'nowrap'}}>{lbl}</div> : null}
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
export const TitleCard: React.FC<{f: number; dur: number}> = ({f}) => {
	const crack = grow(f, 94, 3);
	const mend = grow(f, 128, 14);
	const broken = crack > 0 && mend < 1;
	const shake = broken ? crack * (1 - mend) * Math.sin(f * 2.1) * 10 : 0;
	const pop = 1 + 0.12 * Math.exp(-Math.max(0, f - 94) / 5) * crack;
	return (
		<Bg c="#241638">
			{TITLE.map((line, li) => (
				<text key={li} x={540} y={260 + li * 130} textAnchor="middle" fontSize={98} fontFamily={FONT} fontWeight={900} fill={li === 4 ? '#ffc94a' : '#fff'}>
					{line.map(([w, t], i) => (
						<tspan key={i} fillOpacity={interpolate(f, [t, t + 6], [0, 1], clamp)}>
							{w}
							{i < line.length - 1 ? ' ' : ''}
						</tspan>
					))}
				</text>
			))}
			<g transform={`translate(${shake},1330)`}>
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

/* 006 (лонг 132): «ОСТАНОВИЛСЯ — РАУНД СГОРЕЛ» → «ПОКА РАБОТАЕТ ОДИН» */
export const RuleCard: React.FC<{f: number; dur: number}> = ({f}) => {
	const sw = grow(f, 92, 8);
	const hitK = Math.abs(Math.sin(f / 4));
	let hp: Pose = idle(f, 1);
	hp = reach(reach(hp, 'F', [44, -128], 1), 'B', [30, -106], 1);
	hp = reach(hp, 'F', [150 * hitK + 20, -120], hitK);
	let tp: Pose = idle(f, 4);
	tp = reach(tp, 'F', [60, -60], sw);
	return (
		<Bg c={sw < 0.5 ? '#3a1020' : '#103a20'}>
			{sw < 0.5 ? (
				<g>
					<text x={540} y={330} textAnchor="middle" fontSize={112} fontFamily={FONT} fontWeight={900} fill="#ff6a5a">ОСТАНОВИЛСЯ</text>
					<text x={540} y={500} textAnchor="middle" fontSize={140} fontFamily={FONT} fontWeight={900} fill="#ff6a5a">РАУНД</text>
					<text x={540} y={670} textAnchor="middle" fontSize={140} fontFamily={FONT} fontWeight={900} fill="#ff6a5a">СГОРЕЛ ✗</text>
				</g>
			) : (
				<g>
					<text x={540} y={330} textAnchor="middle" fontSize={140} fontFamily={FONT} fontWeight={900} fill="#5fe08a">ПОКА</text>
					<text x={540} y={500} textAnchor="middle" fontSize={124} fontFamily={FONT} fontWeight={900} fill="#5fe08a">РАБОТАЕТ</text>
					<text x={540} y={700} textAnchor="middle" fontSize={190} fontFamily={FONT} fontWeight={900} fill="#ffd34a">ОДИН</text>
				</g>
			)}
			<rect x={120} y={780} width={840} height={70} rx={35} fill={sw < 0.5 ? '#e2483a' : '#5fe08a'} />
			<text x={540} y={832} textAnchor="middle" fontSize={46} fontFamily={FONT} fontWeight={900} fill="#10132a">{sw < 0.5 ? 'РАУНД ОБОРВАН' : 'РАУНД ИДЁТ'}</text>
			<Actor who="hero" x={270} floor={1830} s={2.2} facing={1} faceTurn={0.4} look={[0.8, 0]} expr="angry" pose={hp} uid="hv1" />
			<Actor who="tema" x={810} floor={1830} s={2.2} facing={-1} faceTurn={0.4} look={[-0.8, 0]} expr="normal" pose={tp} uid="tv1" />
			<rect x={470} y={1830 - 157 * 2.2 + 120} width={110} height={46} rx={10} fill="#7fe0ff" stroke="#10132a" strokeWidth={5} opacity={sw} />
		</Bg>
	);
};

/* 011 (лонг 174): финальный вопрос — в верхней половине кадра */
export const FinalCard: React.FC<{f: number; dur: number}> = ({f, dur}) => {
	const out = interpolate(f, [dur - 26, dur], [0, 1], clamp);
	return (
		<Bg c="#101626">
			<text x={540} y={380} textAnchor="middle" fontSize={96} fontFamily={FONT} fontWeight={900} fill="#fff" opacity={grow(f, 6, 14)}>А ЧТО ТЫ БРОСИЛ</text>
			<text x={540} y={540} textAnchor="middle" fontSize={96} fontFamily={FONT} fontWeight={900} fill="#ffc94a" opacity={grow(f, 30, 14)}>ПОСЛЕ ПЕРВОГО</text>
			<text x={540} y={700} textAnchor="middle" fontSize={96} fontFamily={FONT} fontWeight={900} fill="#ffc94a" opacity={grow(f, 50, 14)}>ПРОПУСКА?</text>
			<text x={540} y={1500} textAnchor="middle" fontSize={620} fontFamily={FONT} fontWeight={900} fill="#ffc94a" opacity={0.18 * grow(f, 60, 20)}>?</text>
			<rect x={0} y={0} width={1080} height={1920} fill="#02030a" opacity={out} />
		</Bg>
	);
};
