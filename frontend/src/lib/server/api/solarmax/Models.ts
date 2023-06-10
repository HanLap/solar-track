export interface getInvertersResponse {
	ivmax: number;
	ivname: string;
	addr: number;
}

export interface MeasurementResponse {
	addr: number;
	pac: number;
	pdc: number;
	kdy: number;
	kt0: number;
	fdat: string;
}
