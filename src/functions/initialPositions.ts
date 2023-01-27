import { SpacePlayerPos } from "~/interfaces/SpacePlayerPos"

export default function setInitialPositions(maxW: number, maxH: number, pSize: number, offset1: number, offset2: number): { initA: SpacePlayerPos[], initB: SpacePlayerPos[] } {
	const keeperLine = 5
	const firstLine = Math.floor(maxW / 7 * .9)
	const secondLine = Math.floor(maxW / 7 * 2.9)
	const thirdLine = Math.floor(maxW / 7 * 5)
	return {
		initA: [
			{ id: 1, x: keeperLine, y: (maxH - pSize) / 2 },
			{ id: 2, x: firstLine, y: maxH - pSize - offset1 * 1.8 },
			{ id: 3, x: firstLine, y: offset1 * 1.8 },
			{ id: 4, x: firstLine, y: (maxH - pSize) / 2 },
			{ id: 5, x: secondLine, y: (maxH - 2 * offset2) / 3 + offset2 - pSize / 2 },
			{ id: 6, x: secondLine, y: (maxH - 2 * offset2) / 3 * 2 + offset2 - pSize / 2 },
			{ id: 7, x: secondLine, y: (maxH - offset2 - pSize) },
			{ id: 8, x: secondLine, y: offset2 },
			{ id: 9, x: thirdLine, y: maxH - pSize - offset1 },
			{ id: 10, x: thirdLine, y: (maxH - pSize) / 2 },
			{ id: 11, x: thirdLine, y: offset1 },
		],
		initB: [
			{ id: 1, x: maxW - keeperLine - pSize, y: (maxH - pSize) / 2 },
			{ id: 2, x: maxW - firstLine - pSize, y: offset1 * 1.8 },
			{ id: 3, x: maxW - firstLine - pSize, y: maxH - pSize - offset1 * 1.8 },
			{ id: 4, x: maxW - firstLine - pSize, y: (maxH - pSize) / 2 },
			{ id: 5, x: maxW - secondLine - pSize, y: (maxH - 2 * offset2) / 3 * 2 + offset2 - pSize / 2 },
			{ id: 6, x: maxW - secondLine - pSize, y: (maxH - 2 * offset2) / 3 + offset2 - pSize / 2 },
			{ id: 7, x: maxW - secondLine - pSize, y: offset2 },
			{ id: 8, x: maxW - secondLine - pSize, y: (maxH - offset2 - pSize) },
			{ id: 9, x: maxW - thirdLine - pSize, y: offset1 },
			{ id: 10, x: maxW - thirdLine - pSize, y: (maxH - pSize) / 2 },
			{ id: 11, x: maxW - thirdLine - pSize, y: maxH - pSize - offset1 },
		]
	}
}
