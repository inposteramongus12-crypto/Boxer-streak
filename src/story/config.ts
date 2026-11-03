/* Story-level settings: «Что если бы один пропуск обнулял 30 дней бокса?» */
export type CounterKeyDef = {line: string; off?: number; v: number; roll?: number};

export const STORY: {
	title: string;
	hero: string; // cast id of the main character
	counter?: {label: string; color?: string; keys: CounterKeyDef[]}; // badge over the hero
	heroAge?: (counter: number) => number;
	heroGrow?: number;
	bed: string; // sound bed in public/ (ambience + sfx, no music)
	musicVolume?: number;
	endCaption?: string[]; // last words on screen (call to action)
} = {
	title: 'Что если бы один пропуск обнулял 30 дней бокса?',
	hero: 'hero',
	counter: {
		label: 'ДЕНЬ',
		keys: [
			{line: '001', v: 29},
			{line: '006', off: 94, v: 0, roll: 3}, // на слове «сгорает» табличка трескается в ноль
			{line: '006', off: 128, v: 29, roll: 14}, // на «пропуск» собирается обратно
			{line: '007', off: 30, v: 0, roll: 50}, // «отмотаем»: счётчик крутится назад
			{line: '010', off: 62, v: 1}, // «загорается единица»
			{line: '026', v: 3}, // «День третий»
			{line: '039', v: 4}, // часть 3: опыты, табличка идёт 4 → 11 (по календарю)
			{line: '041', v: 5},
			{line: '044', v: 6},
			{line: '046', v: 7},
			{line: '048', v: 8},
			{line: '051', v: 9},
			{line: '053', v: 10},
			{line: '057', v: 11},
			{line: '063', v: 12}, // «День двенадцатый»
			{line: '064', v: 15}, // «День пятнадцатый»; «ПАУЗА 14» рисуется сценами, не счётчиком
			{line: '077', v: 18}, // «День восемнадцатый» (число на табличке; календарный день 21)
			{line: '094', v: 22}, // часть 7: «День двадцать второй» (календарный день 25)
			{line: '103', v: 29}, // часть 8: «День двадцать девятый» (календарный день 32)
			// части 9–11: ключи добавим вместе со сценами (календарь — в PROGRESS.md)
		],
	},
	bed: 'sfx/bed.wav',
	endCaption: ['А ТЫ БЫ ПРОПУСТИЛ ДЕНЬ?', 'ПИШИ В КОММЕНТАРИЯХ'],
};
