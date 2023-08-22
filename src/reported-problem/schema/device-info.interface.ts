import { OperatingSystem } from "../reported-problem.enum";

export interface DeviceInfo {
    os: OperatingSystem,
    deviceModel: string,
    appVersion: number
}