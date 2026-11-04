import type React from 'react';
import {C133, C136, C142, C145, FinalCard, RuleCard, TitleCard} from './shortV';

/* 9:16 «recut»: шортс собран из готовой озвучки лонга (реплики 001, 002, 004, 005, 006, 132, 133, 136, 142, 145, 174 —
   см. short-pick.json → short-timeline.json), картинка — вырезки из сцен лонга под 9:16 или вертикальные карточки.
   Seg: line — номер реплики шортса (001…011), ep — реплика лонга, откуда берётся сцена, off — кадры от её начала,
        a/b — окно 9:16 в начале/конце сегмента {cx, cy, z}, C — вертикальная карточка вместо вырезки,
        top — крупные часы вверху: 'hook' (23:41) или 'p9' (время по сцене части 9). */
export type Seg = {
	line: string;
	at?: number;
	ep?: string;
	off?: number;
	cont?: boolean;
	hold?: boolean;
	a?: {cx?: number; cy?: number; z?: number};
	b?: {cx?: number; cy?: number; z?: number};
	C?: React.FC<{f: number; dur: number}>;
	top?: 'hook' | 'p9';
	label?: string; // своя строка под часами вместо таймера раунда
};

export const SHORT: {mode: 'crop'; hook?: string[]; bed?: string} | {mode: 'recut'; segs: Seg[]; hook?: string[]; bed?: string} = {
	mode: 'recut',
	hook: ['11 МИНУТ ДО НУЛЯ'],
	bed: 'sfx/bed_short.wav',
	segs: [
		{line: '001', ep: '001', a: {cx: 640, z: 1.05}, b: {cx: 700, z: 1.25}, top: 'hook'},
		{line: '002', ep: '002', a: {cx: 700}, b: {cx: 720}, top: 'hook'},
		{line: '002', at: 100, ep: '002', off: 100, a: {cx: 1100}, b: {cx: 1330}, top: 'hook'},
		{line: '003', ep: '004', a: {cx: 470}, b: {cx: 520}, top: 'hook'},
		{line: '003', at: 28, ep: '004', off: 28, a: {cx: 1380}, b: {cx: 1400}, top: 'hook'},
		{line: '003', at: 50, ep: '004', off: 50, a: {cx: 920}, b: {cx: 980}, top: 'hook'},
		{line: '003', at: 124, ep: '004', off: 124, a: {cx: 1250}, b: {cx: 1320}, top: 'hook'},
		{line: '004', ep: '005', a: {cx: 780}, b: {cx: 1150}, top: 'hook'},
		{line: '005', C: TitleCard},
		{line: '006', C: RuleCard},
		{line: '007', ep: '133', C: C133, top: 'p9', label: '3+1+3+1+3 = 11 МИНУТ'},
		{line: '008', ep: '136', C: C136, top: 'p9'},
		{line: '009', ep: '142', C: C142, top: 'p9'},
		{line: '010', ep: '145', C: C145, top: 'p9'},
		{line: '011', C: FinalCard},
	],
};
