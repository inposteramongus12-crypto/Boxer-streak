import React from 'react';
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
export const Tag: React.FC<{x: number; y: number; value: number; f: number; s?: number; warn?: boolean; bpm?: number; label?: string; pop?: number; heart?: boolean}> = ({x, y, value, f, s = 0.8, warn = false, bpm = 70, label = 'ДЕНЬ', pop = 1, heart = true}) => {
	const digits = String(Math.floor(value));
	const dw = Math.max(2, digits.length) * 27;
	const w = 26 + (label.length * 16 + 10) + 18 + dw + 22;
	const c = warn && Math.floor(f / 7) % 2 === 0 ? '#ff4a3a' : '#ffc94a';
	return (
		<g>
			<AgeBadge x={x} y={y} value={value} s={s} pop={pop} label={label} c={c} />
			{heart ? <Heart x={x + (w / 2 + 42) * s} y={y - 4 * s} f={f} bpm={bpm} s={s * 0.9} c={bpm > 0 ? '#ff4a5e' : '#7a8296'} /> : null}
		</g>
	);
};
