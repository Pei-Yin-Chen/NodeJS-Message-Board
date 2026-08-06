// 卡片 / Paper 用（輕透、霧面毛玻璃）
export const glassCard = {
  backgroundColor: 'rgba(255, 255, 255, 0.22)',
  backgroundImage: 'none',
  backdropFilter: 'blur(20px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
  border: '1px solid rgba(255, 255, 255, 0.45)',
  boxShadow:
    '0 8px 32px rgba(99, 102, 241, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
  borderRadius: '16px',
}

// 列表卡片用
export const glassCardLite = {
  backgroundColor: 'rgba(255, 255, 255, 0.38)',
  backgroundImage: 'none',
  border: '1px solid rgba(255, 255, 255, 0.45)',
  boxShadow:
    '0 4px 16px rgba(99, 102, 241, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
  borderRadius: '16px',
}

// 卡片內容區：避免 MUI 內層再鋪一層白底
export const glassCardContent = {
  backgroundColor: 'transparent',
}

// 玻璃風捲軸（用於 multiline 輸入框等）
export const glassScrollbar = {
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(99, 102, 241, 0.35) rgba(255, 255, 255, 0.12)',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.12)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(99, 102, 241, 0.35)',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: 'rgba(99, 102, 241, 0.55)',
  },
}

// 輸入框：透明底 + 玻璃邊框（與登入頁一致）
export const glassInput = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.65)',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'primary.main',
  },
  '& textarea': glassScrollbar,
}

// 認證按鈕共用（全站統一 8px 圓角、字重、大小寫）
export const glassAuthButtonBase = {
  borderRadius: '8px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
}

// Navbar / 工具列緊湊尺寸
export const glassAuthCompact = {
  py: 0.75,
  px: 2,
  minWidth: 'auto',
  fontSize: '0.875rem',
}

// 次要 outlined（登入、註冊連結、Google、返回）
export const glassAuthOutlined = {
  ...glassAuthButtonBase,
  py: 1.2,
  color: 'text.secondary',
  borderColor: 'rgba(255, 255, 255, 0.5)',
  backgroundColor: 'rgba(255, 255, 255, 0.12)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  '&:hover': {
    borderColor: 'rgba(255, 255, 255, 0.75)',
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    boxShadow: 'none',
  },
}

// 主要 contained（登入、註冊提交）
export const glassAuthPrimary = {
  ...glassAuthButtonBase,
  py: 1.2,
  color: '#fff',
  backgroundColor: 'primary.main',
  '&:hover': {
    backgroundColor: 'primary.dark',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
  },
}

// 登出 outlined
export const glassAuthLogout = {
  ...glassAuthButtonBase,
  py: 1.2,
  color: 'error.main',
  borderColor: 'rgba(239, 68, 68, 0.45)',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  '&:hover': {
    borderColor: 'rgba(239, 68, 68, 0.65)',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    boxShadow: 'none',
  },
}

// 別名：Google、返回等次要按鈕
export const glassOutlinedButton = glassAuthOutlined

// Navbar 緊湊版
export const glassNavOutlined = { ...glassAuthOutlined, ...glassAuthCompact }
export const glassNavPrimary = { ...glassAuthPrimary, ...glassAuthCompact }
export const glassNavLogout = { ...glassAuthLogout, ...glassAuthCompact }

// 表單 / 區塊標題
export const glassSectionTitle = {
  fontWeight: 'bold',
  color: 'primary.main',
  mb: 3,
  pb: 1,
  borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
  textAlign: 'left',
  width: '100%',
}

// Navbar 用
export const glassNavbar = {
  backgroundColor: 'rgba(255, 255, 255, 0.35)',
  backgroundImage: 'none',
  backdropFilter: 'blur(16px) saturate(1.3)',
  WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
  boxShadow: 'none',
}

// 背景裝飾文字 — 半透明白 + 內高光 + 柔陰影
export const decorativeTextGlass = {
  fontWeight: 900,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  userSelect: 'none',
  lineHeight: 0.95,
  color: 'rgba(255, 255, 255, 0.16)',
  WebkitTextStroke: '1px rgba(255, 255, 255, 0.28)',
  textShadow: [
    '0 1px 0 rgba(255, 255, 255, 0.35)',
    '0 -1px 0 rgba(167, 139, 250, 0.05)',
    '0 0 40px rgba(255, 255, 255, 0.12)',
    '0 8px 32px rgba(99, 102, 241, 0.08)',
    '2px 4px 12px rgba(129, 140, 248, 0.06)',
  ].join(', '),
}

// 背景裝飾文字 — 描邊版
export const decorativeTextGlassOutline = {
  ...decorativeTextGlass,
  color: 'transparent',
  WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.24)',
  textShadow: [
    '0 0 24px rgba(255, 255, 255, 0.08)',
    '0 4px 16px rgba(99, 102, 241, 0.05)',
  ].join(', '),
}

// 全頁背景（漸層：大色團覆蓋卡片區域）
export const pageGradient = {
  backgroundColor: '#ddd6fe',
  backgroundImage: `
    radial-gradient(ellipse 80% 60% at 15% 15%, rgba(167, 139, 250, 0.55), transparent),
    radial-gradient(ellipse 70% 55% at 85% 20%, rgba(96, 165, 250, 0.5), transparent),
    radial-gradient(ellipse 65% 50% at 50% 70%, rgba(196, 181, 253, 0.45), transparent),
    radial-gradient(ellipse 50% 45% at 30% 55%, rgba(129, 140, 248, 0.35), transparent),
    linear-gradient(135deg, #ddd6fe 0%, #bfdbfe 50%, #c7d2fe 100%)
  `,
}

// 固定視窗背景層（漸層 + 裝飾文字，不隨頁面滾動拉長）
export const pageFixedBackground = {
  ...pageGradient,
  position: 'fixed',
  inset: 0,
  zIndex: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
}
