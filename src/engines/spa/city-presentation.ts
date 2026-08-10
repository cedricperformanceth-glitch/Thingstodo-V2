import type { CityProfile } from '../../core/models/types';
export const cityPresentation: Record<CityProfile,{heroScale:string; boardColumns:number}> = { compact:{heroScale:'compact',boardColumns:2},standard:{heroScale:'standard',boardColumns:3},large:{heroScale:'large',boardColumns:3} };
