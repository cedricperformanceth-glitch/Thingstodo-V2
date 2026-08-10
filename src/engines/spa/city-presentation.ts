import type { CityProfile } from '../../core/models/types';
export const cityPresentation: Record<CityProfile,{heroScale:string; boardColumns:number; previewCount:number}> = { compact:{heroScale:'compact',boardColumns:2,previewCount:4},standard:{heroScale:'standard',boardColumns:3,previewCount:6},large:{heroScale:'large',boardColumns:3,previewCount:8} };
