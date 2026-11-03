import React from 'react';
import {interpolateColors} from 'remotion';
import {Svg} from '../engine/camera';
import {AgeBadge, FONT} from '../kit/ui';

/* Boxing gym for this video: dark blue wall, wooden floor, window light, ring ropes behind,
   a heavy bag on a chain (swings by `bag` degrees), jump ropes and a banner on the wall. */
export const Gym: React.FC<{f: number; ring?: boolean}> = ({f, ring = false}) => (
	<Svg>
		<defs>
			<linearGradient id="gy-w" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#25324a" />
				<stop offset="1" stopColor="#35445f" />
			</linearGradient>
			<linearGradient id="gy-f" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#a8754a" />
				<stop offset="1" stopColor="#6e4a2e" />
			</linearGradient>
			<linearGradient id="gy-b" x1="0" y1="0" x2="1" y2="0">
				<stop offset="0" stopColor="#b3281f" />
				<stop offset="0.5" stopColor="#e2483a" />
				<stop offset="1" stopColor="#8f1d17" />
			</linearGradient>
		</defs>
		<rect x={-400} y={-200} width={2800} height={1100} fill="url(#gy-w)" />
		{/* brick band */}
		{Array.from({length: 4}).map((_, r) =>
			Array.from({length: 24}).map((__, c) => <rect key={`${r}-${c}`} x={-300 + c * 130 + (r % 2) * 65} y={560 + r * 80} width={124} height={74} rx={3} fill="#3e506f" opacity={0.55} />),
		)}
		{/* window with a light shaft */}
		<rect x={170} y={150} width={330} height={260} rx={6} fill="#10192b" />
		<rect x={184} y={164} width={302} height={232} fill="#9cc6ea" />
		<line x1={335} y1={164} x2={335} y2={396} stroke="#10192b" strokeWidth={8} />
		<line x1={184} y1={280} x2={486} y2={280} stroke="#10192b" strokeWidth={8} />
		<polygon points="190,400 330,400 900,900 520,900" fill="#fff6d8" opacity={0.1} />
		{/* banner */}
		<g transform="translate(1300,230)">
			<rect width={420} height={110} rx={10} fill="#c9342a" />
			<rect x={8} y={8} width={404} height={94} rx={6} fill="none" stroke="#ffd34a" strokeWidth={4} />
			<text x={210} y={74} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#ffd34a">
				БОКС
			</text>
		</g>
		{/* jump ropes on hooks */}
		{[1260, 1330, 1400].map((x, i) => (
			<g key={x}>
				<circle cx={x} cy={300} r={7} fill="#cfd6e6" />
				<path d={`M${x},300 q-24,${130 + i * 24} 0,${200 + i * 10}`} stroke={['#ffd34a', '#3fc1c9', '#e86aa0'][i]} strokeWidth={6} fill="none" strokeLinecap="round" />
			</g>
		))}
		{/* ring ropes */}
		{ring ? (
			<g>
				<rect x={-60} y={380} width={26} height={520} fill="#1c2438" />
				<rect x={1960} y={380} width={26} height={520} fill="#1c2438" />
				{[470, 580, 690].map((y, i) => (
					<path key={y} d={`M-60,${y} Q960,${y + 26} 1960,${y}`} stroke={['#e2483a', '#f2f2f2', '#e2483a'][i]} strokeWidth={14} fill="none" opacity={0.9} />
				))}
			</g>
		) : null}
		{/* floor */}
		<rect x={-400} y={900} width={2800} height={400} fill="url(#gy-f)" />
		{Array.from({length: 26}).map((_, i) => (
			<line key={i} x1={-300 + i * 120} y1={900} x2={-420 + i * 150} y2={1300} stroke="#00000022" strokeWidth={3} />
		))}
		<rect x={-400} y={896} width={2800} height={8} fill="#2a1a10" opacity={0.5} />
	</Svg>
);

/* heavy bag on a chain: draw it in the actors' layer (depth 1) so punches line up */
export const Bag: React.FC<{x: number; angle?: number}> = ({x: bagX, angle: bag = 0}) => (
	<g transform={`rotate(${bag} ${bagX} 90)`}>
		<defs>
			<linearGradient id="gy-b" x1="0" y1="0" x2="1" y2="0">
				<stop offset="0" stopColor="#b3281f" />
				<stop offset="0.5" stopColor="#e2483a" />
				<stop offset="1" stopColor="#8f1d17" />
			</linearGradient>
		</defs>
		<line x1={bagX} y1={-100} x2={bagX} y2={310} stroke="#cfd6e6" strokeWidth={8} />
		<rect x={bagX - 78} y={300} width={156} height={420} rx={46} fill="url(#gy-b)" />
		<rect x={bagX - 78} y={340} width={156} height={10} fill="none" stroke="#00000033" strokeWidth={3} />
		<rect x={bagX - 78} y={620} width={156} height={10} fill="none" stroke="#00000033" strokeWidth={3} />
	</g>
);

/* ---------- Подъезд: зелёная краска, почтовые ящики, мигающая лампа, чужая дверь справа ---------- */
export const Stairwell: React.FC<{f: number; open?: number}> = ({f, open = 0}) => {
	const flick = Math.sin(f * 1.9) * Math.sin(f * 0.43) > 0.62 ? 0.25 : 1;
	return (
		<Svg>
			<defs>
				<linearGradient id="sw-w" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#c9c3a8" />
					<stop offset="1" stopColor="#a9a387" />
				</linearGradient>
				<radialGradient id="sw-l" cx="0.5" cy="0" r="0.8">
					<stop offset="0" stopColor="#fff3b0" stopOpacity={0.75} />
					<stop offset="1" stopColor="#fff3b0" stopOpacity={0} />
				</radialGradient>
				<linearGradient id="sw-d" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#6b3f26" />
					<stop offset="1" stopColor="#8a5535" />
				</linearGradient>
			</defs>
			<rect x={-400} y={-200} width={2800} height={1100} fill="url(#sw-w)" />
			<rect x={-400} y={560} width={2800} height={340} fill="#4f7a62" />
			<rect x={-400} y={552} width={2800} height={12} fill="#2b4a3a" />
			{/* почтовые ящики */}
			{Array.from({length: 6}).map((_, i) => (
				<g key={i}>
					<rect x={120 + i * 92} y={470} width={80} height={96} rx={4} fill="#5a6b80" stroke="#2c3646" strokeWidth={4} />
					<rect x={134 + i * 92} y={490} width={52} height={8} fill="#1a2030" />
				</g>
			))}
			{/* лестница вверх, силуэт перил */}
			<polygon points="-400,900 -400,640 380,300 380,900" fill="#000" opacity={0.0} />
			<path d="M1560,900 L1560,700 L1960,500 L1960,900 Z" fill="#8b866c" />
			<path d="M1560,700 L1960,500" stroke="#2a2a30" strokeWidth={10} />
			{/* лампа */}
			<polygon points="760,70 960,70 1150,900 570,900" fill="url(#sw-l)" opacity={0.5 * flick} />
			<ellipse cx={860} cy={82} rx={60} ry={22} fill="#fff6c0" opacity={flick} />
			<rect x={850} y={-40} width={20} height={110} fill="#2a2a30" />
			{/* чужая дверь с проёмом */}
			<rect x={1148} y={360} width={310} height={545} fill="#2a2018" />
			<rect x={1172} y={384} width={262} height={520} fill="#ffd9a0" opacity={0.15 + open * 0.85} />
			<polygon points="1172,904 1434,904 1560,960 1060,960" fill="#ffd9a0" opacity={open * 0.35} />
			<g transform={`translate(1172,384) scale(${1 - open * 0.88},1)`}>
				<rect width={262} height={520} fill="url(#sw-d)" />
				<rect x={24} y={30} width={214} height={190} rx={6} fill="none" stroke="#4a2a18" strokeWidth={6} />
				<rect x={24} y={260} width={214} height={210} rx={6} fill="none" stroke="#4a2a18" strokeWidth={6} />
				<circle cx={226} cy={270} r={10} fill="#d9c27a" />
			</g>
			<rect x={1274} y={324} width={60} height={30} rx={4} fill="#d9c27a" />
			<text x={1304} y={348} textAnchor="middle" fontSize={24} fontFamily={FONT} fontWeight={800} fill="#2a2018">
				47
			</text>
			<rect x={-400} y={900} width={2800} height={400} fill="#6e6a60" />
			{Array.from({length: 12}).map((_, i) => (
				<line key={i} x1={-300 + i * 220} y1={900} x2={-420 + i * 260} y2={1300} stroke="#00000030" strokeWidth={4} />
			))}
			<rect x={-400} y={896} width={2800} height={8} fill="#2a2a30" opacity={0.5} />
			<rect x={-400} y={-200} width={2800} height={1100} fill="#0a1020" opacity={0.28} />
		</Svg>
	);
};

/* ---------- Цифровые часы на стене (красные светодиоды) ---------- */
export const Clock: React.FC<{x: number; y: number; text: string; s?: number; blink?: boolean; f?: number}> = ({x, y, text, s = 1, blink = false, f = 0}) => {
	const colon = !blink || Math.floor(f / 15) % 2 === 0;
	return (
		<g transform={`translate(${x},${y}) scale(${s})`}>
			<rect x={-150} y={-60} width={300} height={120} rx={14} fill="#10141f" stroke="#2c3646" strokeWidth={6} />
			<text x={0} y={36} textAnchor="middle" fontSize={96} fontFamily={FONT} fontWeight={800} fill="#ff4a3a" style={{filter: 'drop-shadow(0 0 10px #ff4a3a)'}}>
				{colon ? text : text.replace(':', ' ')}
			</text>
		</g>
	);
};

/* ---------- Улица перед залом: вечер, стена, дверь с вывеской «БОКС» ---------- */
export const BoxStreet: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<defs>
			<linearGradient id="bs-s" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#3b4a78" />
				<stop offset="1" stopColor="#e7a46a" />
			</linearGradient>
		</defs>
		<rect x={-400} y={-300} width={2800} height={1300} fill="url(#bs-s)" />
		{[[-100, 300, 260], [260, 380, 200], [1500, 260, 240], [1800, 340, 220]].map(([x, y, w], i) => (
			<rect key={i} x={x} y={y} width={w} height={900 - y} fill="#2a3150" opacity={0.7} />
		))}
		<rect x={700} y={250} width={760} height={650} fill="#7a4a3a" />
		{Array.from({length: 6}).map((_, r) =>
			Array.from({length: 9}).map((__, c) => <rect key={`${r}-${c}`} x={706 + c * 84 + (r % 2) * 42} y={256 + r * 40} width={80} height={36} rx={3} fill="#8c5846" opacity={0.7} />),
		)}
		<rect x={900} y={430} width={300} height={470} fill="#1f2a44" />
		<rect x={916} y={446} width={268} height={454} fill="#35466e" />
		<circle cx={1160} cy={690} r={9} fill="#ffd34a" />
		{/* вывеска */}
		<g transform="translate(790,300)">
			<rect width={580} height={120} rx={12} fill="#c9342a" />
			<rect x={8} y={8} width={564} height={104} rx={8} fill="none" stroke="#ffd34a" strokeWidth={5} />
			<text x={290} y={84} textAnchor="middle" fontSize={78} fontFamily={FONT} fontWeight={900} fill="#ffd34a" style={{filter: `drop-shadow(0 0 ${8 + Math.sin(f / 9) * 3}px #ffd34a)`}}>
				БОКС
			</text>
		</g>
		<rect x={-400} y={900} width={2800} height={400} fill="#58586a" />
		<rect x={-400} y={896} width={2800} height={14} fill="#8a8a9a" />
		<rect x={-400} y={-300} width={2800} height={1300} fill="#10132a" opacity={0.12} />
	</Svg>
);

/* ---------- Табличка «ДЕНЬ N» с сердцем-пульсом. warn — мигает красным (день не засчитан) ---------- */
export const Heart: React.FC<{x: number; y: number; f: number; bpm?: number; s?: number; c?: string}> = ({x, y, f, bpm = 70, s = 1, c = '#ff4a5e'}) => {
	const period = (60 / Math.max(1, bpm)) * 30;
	const ph = (f % period) / period;
	const beat = bpm > 0 ? 1 + 0.28 * Math.max(0, Math.sin(ph * Math.PI * 2 * 1)) ** 3 : 1;
	return (
		<g transform={`translate(${x},${y}) scale(${s * beat})`}>
			<path d="M0,16 C-34,-6 -22,-30 -9,-26 C-4,-25 0,-20 0,-16 C0,-20 4,-25 9,-26 C22,-30 34,-6 0,16 Z" fill={c} stroke="#10132a" strokeWidth={3} />
		</g>
	);
};
// цвет сердца по пульсу: серое (покой) → жёлтое (не засчитывается) → красное (считается)
export const heartColor = (bpm: number) => interpolateColors(bpm, [85, 115, 145], ['#8c93a8', '#ffd34a', '#ff4a5e']);
export const Tag: React.FC<{x: number; y: number; value: number; f: number; s?: number; warn?: boolean; ok?: boolean; grey?: boolean; bpm?: number; label?: string; pop?: number; heart?: boolean; auto?: boolean; showBpm?: boolean; heartK?: number}> = ({x, y, value, f, s = 0.8, warn = false, ok = false, grey = false, bpm = 70, label = 'ДЕНЬ', pop = 1, heart = true, auto = false, showBpm = false, heartK = 1}) => {
	const digits = String(Math.floor(value));
	const dw = Math.max(2, digits.length) * 27;
	const w = 26 + (label.length * 16 + 10) + 18 + dw + 22;
	const c = grey ? '#aab1c4' : ok ? '#5fe08a' : warn && Math.floor(f / 7) % 2 === 0 ? '#ff4a3a' : '#ffc94a';
	const hc = auto ? heartColor(bpm) : bpm > 0 ? '#ff4a5e' : '#7a8296';
	const hx = x + (w / 2 + 42) * s;
	return (
		<g>
			<AgeBadge x={x} y={y} value={value} s={s} pop={pop} label={label} c={c} />
			{heart && heartK > 0.02 ? <Heart x={hx} y={y - 4 * s} f={f} bpm={bpm} s={s * 0.9 * heartK} c={hc} /> : null}
			{heart && showBpm && heartK > 0.5 ? (
				<text x={hx + 40 * s} y={y + 15 * s} fontSize={44 * s} fontFamily={FONT} fontWeight={800} fill={hc} stroke="#10132a" strokeWidth={6 * s} paintOrder="stroke">
					{Math.round(bpm)}
				</text>
			) : null}
		</g>
	);
};

/* ---------- Лестница вниз с перилами: 5 ступеней 170×72 слева сверху направо вниз, площадка на y=900 ---------- */
export const STEP = {x0: 380, w: 170, h: 72, n: 5};
export const stepY = (i: number) => 900 - (STEP.n - Math.min(STEP.n, Math.max(0, i))) * STEP.h; // поверхность ступени i (i=5 — площадка)
export const StairDown: React.FC = () => (
	<Svg>
		<defs>
			<linearGradient id="sd-w" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#c9c3a8" />
				<stop offset="1" stopColor="#a39d82" />
			</linearGradient>
		</defs>
		<rect x={-400} y={-200} width={2800} height={1100} fill="url(#sd-w)" />
		<rect x={-400} y={470} width={2800} height={430} fill="#58806a" opacity={0.9} />
		<rect x={-400} y={462} width={2800} height={10} fill="#2b4a3a" />
		<rect x={1500} y={300} width={260} height={400} rx={6} fill="#cfe6f5" stroke="#6b6a60" strokeWidth={10} />
		<line x1={1630} y1={300} x2={1630} y2={700} stroke="#6b6a60" strokeWidth={8} />
		{Array.from({length: STEP.n + 1}).map((_, i) => (
			<g key={i}>
				<rect x={STEP.x0 + i * STEP.w - (i === STEP.n ? 0 : 0)} y={stepY(i)} width={i === STEP.n ? 1400 : STEP.w + 2} height={1100} fill={i % 2 ? '#8a867a' : '#939083'} />
				<rect x={STEP.x0 + i * STEP.w} y={stepY(i)} width={i === STEP.n ? 1400 : STEP.w + 2} height={10} fill="#bdb9a8" />
			</g>
		))}
		<rect x={-400} y={stepY(0) + 200} width={STEP.x0 + 400} height={1100} fill="#939083" />
		<rect x={-400} y={stepY(0)} width={STEP.x0 + 400} height={10} fill="#bdb9a8" />
	</Svg>
);
// перила: линия на 170 px выше ступеней
export const railY = (x: number) => {
	const t = Math.min(1, Math.max(0, (x - STEP.x0) / (STEP.n * STEP.w)));
	return stepY(0) + t * (900 - stepY(0)) - 170;
};
export const Rail: React.FC = () => {
	const x1 = STEP.x0 - 60;
	const x2 = STEP.x0 + STEP.n * STEP.w + 60;
	return (
		<g>
			{[0, 1, 2, 3, 4, 5].map((i) => {
				const x = STEP.x0 + i * STEP.w + 40;
				return <line key={i} x1={x} y1={railY(x)} x2={x} y2={stepY(i)} stroke="#2a2a30" strokeWidth={7} />;
			})}
			<line x1={x1} y1={railY(x1)} x2={x2} y2={railY(x2)} stroke="#2a2a30" strokeWidth={14} strokeLinecap="round" />
			<line x1={x1} y1={railY(x1) - 4} x2={x2} y2={railY(x2) - 4} stroke="#d9a15a" strokeWidth={6} strokeLinecap="round" />
		</g>
	);
};

/* ---------- Комната героя: вечер/ночь, окно, полка, торшер, деревянный пол ---------- */
export const Room: React.FC<{f: number; night?: boolean}> = ({night = false}) => (
	<Svg>
		<defs>
			<linearGradient id={night ? 'rm-wn' : 'rm-wd'} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor={night ? '#262b48' : '#e9d8bd'} />
				<stop offset="1" stopColor={night ? '#343a5c' : '#d9c3a0'} />
			</linearGradient>
			<linearGradient id="rm-f" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor={night ? '#5a4636' : '#b98a5c'} />
				<stop offset="1" stopColor={night ? '#3a2c22' : '#7e5a3a'} />
			</linearGradient>
			<radialGradient id="rm-l" cx="0.5" cy="0.1" r="0.9">
				<stop offset="0" stopColor="#ffe3a0" stopOpacity={night ? 0.65 : 0.45} />
				<stop offset="1" stopColor="#ffe3a0" stopOpacity={0} />
			</radialGradient>
		</defs>
		<rect x={-400} y={-200} width={2800} height={1100} fill={`url(#${night ? 'rm-wn' : 'rm-wd'})`} />
		{/* окно */}
		<rect x={210} y={140} width={380} height={330} rx={8} fill="#1d2338" />
		<rect x={226} y={156} width={348} height={298} fill={night ? '#0b1030' : '#f0a86a'} />
		<rect x={226} y={156} width={348} height={150} fill={night ? '#1a2050' : '#e8805a'} opacity={0.8} />
		{night ? [[290, 220], [380, 190], [500, 250], [450, 330]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill="#fff" opacity={0.8} />) : null}
		<line x1={400} y1={156} x2={400} y2={454} stroke="#1d2338" strokeWidth={10} />
		<line x1={226} y1={305} x2={574} y2={305} stroke="#1d2338" strokeWidth={10} />
		{/* полка с книгами */}
		<rect x={1200} y={300} width={420} height={16} fill="#6e4a2e" />
		{[0, 1, 2, 3, 4, 5, 6].map((i) => (
			<rect key={i} x={1214 + i * 52} y={300 - 90 + (i % 3) * 12} width={42} height={90 - (i % 3) * 12} fill={['#c9342a', '#2f6fd8', '#f2b21c', '#3aa37a', '#8b5cf6', '#e86aa0', '#3fc1c9'][i]} />
		))}
		{/* торшер */}
		<line x1={1750} y1={460} x2={1750} y2={900} stroke="#2a2a32" strokeWidth={8} />
		<path d="M1690,470 Q1750,380 1810,470 Z" fill="#ffd9a0" />
		<polygon points="1690,470 1810,470 2050,900 1450,900" fill="url(#rm-l)" opacity={0.55} />
		<rect x={-400} y={900} width={2800} height={400} fill="url(#rm-f)" />
		{Array.from({length: 22}).map((_, i) => (
			<line key={i} x1={-300 + i * 140} y1={900} x2={-420 + i * 175} y2={1300} stroke="#00000030" strokeWidth={3} />
		))}
		<rect x={-400} y={896} width={2800} height={8} fill="#2a1a10" opacity={0.5} />
		{night ? <rect x={-400} y={-200} width={2800} height={1100} fill="#0a1020" opacity={0.18} /> : null}
	</Svg>
);

/* ---------- Люстра на кухне: качается на угол `a` градусов ---------- */
export const Chandelier: React.FC<{x: number; a: number}> = ({x, a}) => (
	<g transform={`rotate(${a} ${x} -40)`}>
		<line x1={x} y1={-40} x2={x} y2={240} stroke="#2a2a32" strokeWidth={6} />
		<path d={`M${x - 110},300 Q${x},170 ${x + 110},300 Z`} fill="#f2b21c" stroke="#10132a" strokeWidth={4} />
		<ellipse cx={x} cy={302} rx={110} ry={14} fill="#ffe3a0" />
		<ellipse cx={x} cy={318} rx={46} ry={9} fill="#fff6c0" opacity={0.9} />
	</g>
);

/* ---------- Двор за гаражами: ряд гаражей, забор из плит, турник, фонарь. night — ночь с конусом света ---------- */
export const Yard: React.FC<{f: number; night?: boolean}> = ({f, night = false}) => (
	<Svg>
		<defs>
			<linearGradient id={night ? 'yd-sn' : 'yd-sd'} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor={night ? '#0b1030' : '#4a5a8a'} />
				<stop offset="1" stopColor={night ? '#2a2f63' : '#f0a56a'} />
			</linearGradient>
			<radialGradient id="yd-l" cx="0.5" cy="0" r="1">
				<stop offset="0" stopColor="#ffe9a8" stopOpacity={0.8} />
				<stop offset="1" stopColor="#ffe9a8" stopOpacity={0} />
			</radialGradient>
		</defs>
		<rect x={-400} y={-300} width={2800} height={1300} fill={`url(#${night ? 'yd-sn' : 'yd-sd'})`} />
		{/* дальние многоэтажки */}
		{[[-150, 220, 300], [200, 320, 240], [1300, 180, 280], [1650, 300, 260], [1950, 240, 300]].map(([x, y, w], i) => (
			<g key={i}>
				<rect x={x} y={y} width={w} height={900 - y} fill={night ? '#1b2142' : '#35406a'} />
				{Array.from({length: 6}).map((_, r) => Array.from({length: 3}).map((__, c) => <rect key={`${r}${c}`} x={x + 30 + c * (w / 3.4)} y={y + 40 + r * 70} width={36} height={40} fill={night && (r + c + i) % 3 === 0 ? '#ffd98a' : '#00000040'} opacity={0.8} />))}
			</g>
		))}
		{/* гаражи */}
		{[-120, 280, 680, 1080].map((x, i) => (
			<g key={x}>
				<rect x={x} y={500} width={390} height={400} fill={['#8a6a58', '#6f7f8f', '#8f5a4a', '#6a7f6a'][i]} />
				<rect x={x - 10} y={486} width={410} height={26} fill="#2a2a32" />
				<rect x={x + 30} y={540} width={330} height={360} fill={['#b9503c', '#4b6a8a', '#c9a23c', '#4a7a5a'][i]} />
				{Array.from({length: 8}).map((_, k) => (
					<line key={k} x1={x + 30} y1={580 + k * 44} x2={x + 360} y2={580 + k * 44} stroke="#00000040" strokeWidth={4} />
				))}
				<rect x={x + 150} y={640} width={90} height={14} fill="#2a2a32" />
			</g>
		))}
		{/* турник */}
		<line x1={1560} y1={560} x2={1560} y2={900} stroke="#2a2a32" strokeWidth={14} />
		<line x1={1860} y1={560} x2={1860} y2={900} stroke="#2a2a32" strokeWidth={14} />
		<line x1={1550} y1={560} x2={1870} y2={560} stroke="#cfd6e6" strokeWidth={12} strokeLinecap="round" />
		{/* забор из плит */}
		<rect x={1940} y={690} width={600} height={210} fill="#9a9a9a" />
		{[0, 1, 2].map((i) => (
			<rect key={i} x={1950 + i * 200} y={700} width={190} height={190} fill="#b3b3b3" stroke="#6a6a6a" strokeWidth={4} />
		))}
		{/* фонарь */}
		<line x1={1480} y1={120} x2={1480} y2={900} stroke="#1a1a22" strokeWidth={12} />
		<rect x={1420} y={100} width={120} height={24} rx={8} fill="#1a1a22" />
		<ellipse cx={1480} cy={130} rx={46} ry={10} fill={night ? '#fff3b0' : '#c9c6b0'} opacity={night ? 1 : 0.7} />
		{night ? <polygon points="1440,130 1520,130 1920,900 1040,900" fill="url(#yd-l)" opacity={0.7 + Math.sin(f / 5) * 0.03} /> : null}
		<rect x={-400} y={900} width={2800} height={400} fill={night ? '#2d3040' : '#6b6a72'} />
		{Array.from({length: 14}).map((_, i) => (
			<ellipse key={i} cx={-200 + i * 210} cy={980 + (i % 3) * 30} rx={40} ry={8} fill="#00000025" />
		))}
		<rect x={-400} y={896} width={2800} height={10} fill="#1a1a22" opacity={0.45} />
		{night ? <rect x={-400} y={-300} width={2800} height={1300} fill="#050818" opacity={0.28} /> : null}
	</Svg>
);

/* ---------- Школьный стадион: небо, трибуны, поле с воротами, беговая дорожка ---------- */
export const Stadium: React.FC<{f: number}> = () => (
	<Svg>
		<defs>
			<linearGradient id="st-s" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#6aa0d8" />
				<stop offset="1" stopColor="#f6d3a0" />
			</linearGradient>
		</defs>
		<rect x={-400} y={-300} width={2800} height={1100} fill="url(#st-s)" />
		{/* трибуны */}
		{[0, 1, 2].map((i) => (
			<rect key={i} x={-100} y={330 + i * 50} width={1500} height={52} fill={['#c9342a', '#e2483a', '#b3281f'][i]} opacity={0.9} />
		))}
		<rect x={-100} y={330} width={1500} height={10} fill="#10132a" opacity={0.3} />
		{/* поле и ворота */}
		<rect x={-400} y={480} width={2800} height={210} fill="#4a9a58" />
		{Array.from({length: 10}).map((_, i) => (
			<rect key={i} x={-400 + i * 300} y={480} width={150} height={210} fill="#3f8a4e" opacity={0.7} />
		))}
		<g stroke="#f2f2f2" strokeWidth={10} fill="none">
			<path d="M1500,560 L1500,470 L1740,470 L1740,560" />
		</g>
		<path d="M1500,470 L1740,470 L1740,560 L1500,560 Z" fill="#ffffff" opacity={0.18} />
		{/* дорожка */}
		<rect x={-400} y={690} width={2800} height={520} fill="#c4573c" />
		{[0, 1, 2, 3].map((i) => (
			<rect key={i} x={-400} y={740 + i * 82} width={2800} height={6} fill="#f2f2f2" opacity={0.85} />
		))}
		<rect x={-400} y={686} width={2800} height={10} fill="#f2f2f2" opacity={0.7} />
		{/* забор вокруг */}
		<rect x={-400} y={660} width={2800} height={10} fill="#2a2a32" />
	</Svg>
);

/* ---------- Фасад дома Тёмы: подъезд с козырьком, окно брата на втором этаже, скамейка, куст, фонарь ---------- */
export const Facade: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<defs>
			<linearGradient id="fc-s" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#2f3a6a" />
				<stop offset="1" stopColor="#e39a6a" />
			</linearGradient>
			<radialGradient id="fc-w" cx="0.5" cy="0.5" r="0.7">
				<stop offset="0" stopColor="#ffe3a0" stopOpacity={0.55} />
				<stop offset="1" stopColor="#ffe3a0" stopOpacity={0} />
			</radialGradient>
		</defs>
		<rect x={-400} y={-300} width={2800} height={1300} fill="url(#fc-s)" />
		<rect x={-200} y={60} width={2600} height={840} fill="#8c5a48" />
		{Array.from({length: 11}).map((_, r) =>
			Array.from({length: 26}).map((__, c) => <rect key={`${r}-${c}`} x={-190 + c * 104 + (r % 2) * 52} y={70 + r * 76} width={98} height={70} rx={3} fill="#9a6652" opacity={0.7} />),
		)}
		{/* подъезд */}
		<rect x={380} y={520} width={300} height={380} fill="#2a2018" />
		<rect x={400} y={540} width={260} height={360} fill="#ffd9a0" opacity={0.28} />
		<rect x={340} y={500} width={380} height={34} rx={6} fill="#3a4256" />
		<rect x={700} y={640} width={50} height={90} rx={6} fill="#cfd6e6" />
		<circle cx={725} cy={670} r={7} fill="#ffd34a" />
		<rect x={340} y={900} width={380} height={14} fill="#6a6a72" />
		{/* окно брата */}
		<rect x={1480} y={230} width={270} height={260} rx={6} fill="#2a2018" />
		<rect x={1496} y={246} width={238} height={228} fill="#ffd9a0" />
		<ellipse cx={1615} cy={360} rx={260} ry={220} fill="url(#fc-w)" />
		{/* окна соседей */}
		{[[900, 230], [1180, 230], [900, 540], [1180, 540], [1860, 230], [1860, 540]].map(([x, y], i) => (
			<rect key={i} x={x} y={y} width={190} height={210} rx={6} fill={i % 2 ? '#ffd98a' : '#2d3350'} opacity={0.85} />
		))}
		{/* скамейка и куст */}
		<rect x={1000} y={820} width={260} height={16} fill="#6e4a2e" />
		<rect x={1010} y={836} width={14} height={64} fill="#2a1a10" />
		<rect x={1236} y={836} width={14} height={64} fill="#2a1a10" />
		<ellipse cx={1850} cy={850} rx={150} ry={86} fill="#2f6f46" />
		<ellipse cx={1780} cy={820} rx={90} ry={64} fill="#3a8656" />
		<rect x={-400} y={900} width={2800} height={400} fill="#4a4a56" />
		<rect x={-400} y={896} width={2800} height={12} fill="#7a7a86" />
		<rect x={-400} y={-300} width={2800} height={1300} fill="#10132a" opacity={0.1} />
	</Svg>
);

/* ---------- Кинозал: тёмный зал, экран светится и мерцает, ряды кресел ---------- */
export const Cinema: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<defs>
			<radialGradient id="cn-g" cx="0.5" cy="0" r="1">
				<stop offset="0" stopColor="#bfe0ff" stopOpacity={0.55} />
				<stop offset="1" stopColor="#bfe0ff" stopOpacity={0} />
			</radialGradient>
		</defs>
		<rect x={-400} y={-300} width={2800} height={1400} fill="#12102a" />
		<rect x={560} y={80} width={800} height={380} rx={8} fill="#e8f4ff" opacity={0.85 + Math.sin(f / 3) * 0.05} />
		<rect x={600} y={120} width={720} height={300} fill="#5aa0e8" opacity={0.7} />
		<circle cx={960 + Math.sin(f / 20) * 90} cy={270} r={60} fill="#ffd34a" opacity={0.85} />
		<polygon points="560,460 1360,460 1700,900 220,900" fill="url(#cn-g)" opacity={0.55} />
		<rect x={-400} y={900} width={2800} height={400} fill="#2a1530" />
		{[0, 1, 2, 3, 4].map((i) => (
			<g key={i}>
				<rect x={90 + i * 380} y={760} width={200} height={150} rx={40} fill="#6b1f3a" />
				<rect x={110 + i * 380} y={740} width={160} height={40} rx={20} fill="#8a2a4a" />
			</g>
		))}
	</Svg>
);

/* ---------- Диван (передний план: спинка и сиденье) ---------- */
export const Couch: React.FC<{x0: number; x1: number}> = ({x0, x1}) => (
	<g>
		<rect x={x0} y={700} width={x1 - x0} height={90} rx={20} fill="#5a6fa8" stroke="#10132a" strokeWidth={5} />
		<rect x={x0 - 30} y={760} width={x1 - x0 + 60} height={110} rx={20} fill="#4a5e96" stroke="#10132a" strokeWidth={5} />
		<rect x={x0 - 40} y={700} width={50} height={170} rx={20} fill="#3f5183" stroke="#10132a" strokeWidth={5} />
		<rect x={x1 - 10} y={700} width={50} height={170} rx={20} fill="#3f5183" stroke="#10132a" strokeWidth={5} />
		<rect x={x0 + 20} y={866} width={26} height={34} fill="#2a1a10" />
		<rect x={x1 - 46} y={866} width={26} height={34} fill="#2a1a10" />
	</g>
);

/* ---------- Актовый зал: сцена с занавесом, софиты; в кадре передний ряд кресел ---------- */
export const ConcertHall: React.FC<{f: number; open?: number}> = ({f, open = 1}) => (
	<Svg>
		<defs>
			<linearGradient id="ch-w" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#241a36" />
				<stop offset="1" stopColor="#3a2a4a" />
			</linearGradient>
			<radialGradient id="ch-s" cx="0.5" cy="0" r="1">
				<stop offset="0" stopColor="#fff3c0" stopOpacity={0.8} />
				<stop offset="1" stopColor="#fff3c0" stopOpacity={0} />
			</radialGradient>
		</defs>
		<rect x={-400} y={-300} width={2800} height={1300} fill="url(#ch-w)" />
		<rect x={240} y={560} width={1440} height={170} fill="#7a5a3a" />
		<rect x={240} y={548} width={1440} height={16} fill="#b98a5c" />
		<rect x={300} y={60} width={1320} height={500} fill="#3a2a4a" />
		{/* занавес раздвигается на open (0 — закрыт) */}
		<rect x={300} y={40} width={(1 - open) * 660 + 140} height={520} fill="#b3281f" />
		<rect x={1620 - ((1 - open) * 660 + 140)} y={40} width={(1 - open) * 660 + 140} height={520} fill="#b3281f" />
		{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={320 + i * 36} y={40} width={10} height={520} fill="#7a1812" opacity={0.6} />)}
		<rect x={300} y={30} width={1320} height={30} fill="#e2b04a" />
		<polygon points="760,60 1160,60 1380,560 540,560" fill="url(#ch-s)" opacity={0.35 + Math.sin(f / 20) * 0.03} />
		<rect x={-400} y={730} width={2800} height={600} fill="#2a2038" />
		{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-120 + i * 480} y={900} width={380} height={160} rx={44} fill="#6b1f3a" />)}
	</Svg>
);

/* ---------- Ночная дорога: фонари и дома бегут слева направо при scroll>0 ---------- */
export const NightRoad: React.FC<{scroll: number}> = ({scroll}) => {
	const m = (v: number, p: number) => ((v % p) + p) % p;
	return (
		<Svg>
			<defs>
				<linearGradient id="nr-s" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#070a22" />
					<stop offset="1" stopColor="#2a2f63" />
				</linearGradient>
				<radialGradient id="nr-l" cx="0.5" cy="0" r="1">
					<stop offset="0" stopColor="#ffe9a8" stopOpacity={0.7} />
					<stop offset="1" stopColor="#ffe9a8" stopOpacity={0} />
				</radialGradient>
			</defs>
			<rect x={-400} y={-300} width={2800} height={1300} fill="url(#nr-s)" />
			{Array.from({length: 9}).map((_, i) => {
				const x = -300 + m(i * 330 - scroll * 0.35, 2970);
				const h = 260 + ((i * 97) % 220);
				return (
					<g key={i}>
						<rect x={x} y={900 - h - 100} width={290} height={h + 100} fill="#171c3c" />
						{[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={x + 40 + c * 120} y={900 - h - 60 + r * 80} width={60} height={46} fill={(i + r + c) % 3 === 0 ? '#ffd98a' : '#00000055'} />))}
					</g>
				);
			})}
			<rect x={-400} y={900} width={2800} height={400} fill="#23263a" />
			<rect x={-400} y={896} width={2800} height={10} fill="#4a4e6a" />
			{Array.from({length: 6}).map((_, i) => <rect key={i} x={-300 + m(i * 520 - scroll * 1.1, 3120)} y={990} width={220} height={14} fill="#c8c8d0" opacity={0.55} />)}
			{Array.from({length: 6}).map((_, i) => {
				const x = -200 + m(i * 560 - scroll * 0.85, 3360);
				return (
					<g key={i}>
						<polygon points={`${x - 30},120 ${x + 30},120 ${x + 210},900 ${x - 210},900`} fill="url(#nr-l)" opacity={0.4} />
						<line x1={x} y1={120} x2={x} y2={900} stroke="#10132a" strokeWidth={12} />
						<ellipse cx={x} cy={118} rx={44} ry={10} fill="#fff3b0" />
					</g>
				);
			})}
		</Svg>
	);
};
