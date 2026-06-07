import React from 'react'

const s = (d: string, v?: string) => (
  <svg width="24" height="24" viewBox={v || "0 0 24 24"} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d={d} fill="currentColor" />
  </svg>
)

const sp = (d: string) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const PlusIcon = () => s("M12 5v14M5 12h14")
export const CloseIcon = () => s("M18 6L6 18M6 6l12 12")
export const BoxIcon = () => s("M3 3h18v18H3z")
export const CheckCircleIcon = () => s("M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-2-8l-2-2-1.5 1.5L10 15l6-6-1.5-1.5z")
export const AlertIcon = () => s("M12 2L1 21h22M12 9v4M12 17v.01")
export const InfoIcon = () => s("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z")
export const ErrorIcon = InfoIcon
export const BoltIcon = () => s("M13 2L3 14h9l-1 8 10-12h-9l1-8z")
export const ArrowUpIcon = () => s("M12 5v14M5 12l7-7 7 7")
export const ArrowDownIcon = () => s("M12 19V5M5 12l7 7 7-7")
export const FolderIcon = () => s("M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z")
export const VideoIcon = () => s("M8 5v14l11-7z")
export const AudioIcon = () => s("M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z")
export const GridIcon = () => s("M5 3h4v4H5zm6 0h4v4h-4zm6 0h4v4h-4zM5 9h4v4H5zm6 0h4v4h-4zm6 0h4v4h-4zM5 15h4v4H5zm6 0h4v4h-4zm6 0h4v4h-4z")
export const FileIcon = () => s("M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm0 18V4h7v5h5v11H6z")
export const DownloadIcon = () => s("M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z")
export const ArrowRightIcon = () => s("M5 12h14M12 5l7 7-7 7")
export const GroupIcon = () => s("M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z")

export const BoxIconLine = () => sp("M3 3h18v18H3zM3 9h18M9 21V9")
export const ShootingStarIcon = () => sp("M12 2l2 7h7l-5.5 4 2 7L12 15l-5.5 5 2-7L3 9h7z")
export const DollarLineIcon = () => sp("M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6")
export const TrashBinIcon = () => sp("M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z")
export const AngleUpIcon = () => s("M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z")
export const AngleDownIcon = () => s("M12 16l-6-6 1.41-1.41L12 13.17l4.59-4.58L18 10z")
export const AngleLeftIcon = () => s("M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z")
export const AngleRightIcon = () => s("M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z")
export const PencilIcon = () => sp("M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z")
export const CheckLineIcon = () => sp("M5 12l5 5L20 7")
export const CloseLineIcon = () => sp("M18 6L6 18M6 6l12 12")
export const ChevronDownIcon = () => s("M6 9l6 6 6-6")
export const ChevronUpIcon = () => s("M18 15l-6-6-6 6")
export const PaperPlaneIcon = () => s("M2.01 21L23 12 2.01 3 2 10l15 2-15 2z")
export const LockIcon = () => s("M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z")
export const EnvelopeIcon = () => s("M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z")
export const UserIcon = () => s("M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z")
export const CalenderIcon = () => s("M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z")
export const EyeIcon = () => s("M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z")
export const EyeCloseIcon = () => s("M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z")
export const TimeIcon = () => s("M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z")
export const CopyIcon = () => s("M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z")
export const ChevronLeftIcon = () => s("M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z")
export const UserCircleIcon = () => s("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z")
export const TaskIcon = () => sp("M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11")
export const ListIcon = () => s("M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z")
export const TableIcon = () => s("M3 3h18v18H3V3zm2 2v4h14V5H5zm14 6H5v4h14v-4zm0 6H5v2h14v-2z")
export const PageIcon = () => s("M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-2 18H6V4h7v5h5v11h-6z")
export const PieChartIcon = () => s("M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2 0v9h9c-.5-4.76-4.24-8.5-9-9zm0 11v9c4.76-.5 8.5-4.24 9-9h-9z")
export const BoxCubeIcon = () => s("M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z")
export const PlugInIcon = () => s("M19 10V8h-4V6c0-1.1-.9-2-2-2s-2 .9-2 2v2H5v2h2v6H5v2h4v2h6v-2h4v-2h-2v-6h2zm-6 6h-2v-6h2v6z")
export const DocsIcon = () => s("M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6zm2-6h8v2H8v-2zm0-3h8v2H8v-2zm0 6h5v2H8v-2z")
export const MailIcon = () => s("M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z")
export const HorizontaLDots = () => s("M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z")
export const ChatIcon = () => s("M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z")
export const MoreDotIcon = () => s("M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z")
export const AlertHexaIcon = () => s("M12 2L1 21h22M12 9v4M12 17v.01")
export const ErrorHexaIcon = () => s("M12 2L1 21h22M12 9v4M12 17v.01")
