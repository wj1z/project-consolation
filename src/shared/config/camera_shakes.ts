const CameraShakes: { [id: string]: CameraShakePreset } = {
    startup: {
        magnitude: 0.35,
        roughness: 35,
        fade_in_time: 0,
        fade_out_time: 1.5
    },
    pre_restart: {
        magnitude: 0.25,
        roughness: 25,
        fade_in_time: 0,
        fade_out_time: 0.65
    },
    restart: {
        magnitude: 0.8,
        roughness: 30,
        fade_in_time: 0,
        fade_out_time: 0.75
    },
    cycle: {
        magnitude: 0.1,
        roughness: 30,
        fade_in_time: 0,
        fade_out_time: 0.5
    }
}

export type CameraShakePreset = {
    magnitude: number,
    roughness: number,
    fade_in_time?: number,
    fade_out_time?: number
}

export default CameraShakes;