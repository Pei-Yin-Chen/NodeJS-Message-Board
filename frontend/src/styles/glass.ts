// 卡片 / Paper 用（輕透、霧面毛玻璃）
export const glassCard = {
  backgroundColor: 'rgba(255, 255, 255, 0.22)',
  backgroundImage: 'none',
  backdropFilter: 'blur(20px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
  border: '1px solid rgba(255, 255, 255, 0.45)',
  boxShadow:
    '0 8px 32px rgba(120, 96, 72, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
  borderRadius: '16px',
}

// 列表卡片用（無 backdrop-filter，避免多張卡片疊加 blur 造成繪製卡頓）
export const glassCardLite = {
  backgroundColor: 'rgba(255, 255, 255, 0.38)',
  backgroundImage: 'none',
  border: '1px solid rgba(255, 255, 255, 0.45)',
  boxShadow:
    '0 4px 16px rgba(120, 96, 72, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
  borderRadius: '16px',
}

// 卡片內容區：避免 MUI 內層再鋪一層白底
export const glassCardContent = {
  backgroundColor: 'transparent',
}

// 玻璃風捲軸（用於多行輸入框等）
export const glassScrollbar = {
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(143, 115, 85, 0.35) rgba(255, 255, 255, 0.12)',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.12)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(143, 115, 85, 0.35)',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: 'rgba(143, 115, 85, 0.55)',
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
  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 100px rgba(255, 255, 255, 0.22) inset',
    WebkitTextFillColor: 'inherit',
    caretColor: 'inherit',
    transition: 'background-color 9999s ease-out 0s',
  },
  '& input:-webkit-autofill:hover': {
    WebkitBoxShadow: '0 0 0 100px rgba(255, 255, 255, 0.28) inset',
  },
  '& input:-webkit-autofill:focus': {
    WebkitBoxShadow: '0 0 0 100px rgba(255, 255, 255, 0.32) inset',
  },
  '& input::-ms-reveal': {
    display: 'none',
  },
  '& input::-ms-clear': {
    display: 'none',
  },
  '& input::-webkit-credentials-auto-fill-button': {
    visibility: 'hidden',
    pointerEvents: 'none',
  },
}

// 認證按鈕共用（全站統一 8px 圓角、字重、大小寫）
export const glassAuthButtonBase = {
  borderRadius: '8px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
}

// 導覽列 / 工具列緊湊尺寸
export const glassAuthCompact = {
  py: 0.75,
  px: 2,
  minWidth: 'auto',
  fontSize: '0.875rem',
}

// 次要外框按鈕（登入、註冊連結、Google、返回）
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

// 主要實心按鈕（登入、註冊提交）
export const glassAuthPrimary = {
  ...glassAuthButtonBase,
  py: 1.2,
  color: '#fff',
  backgroundColor: 'primary.main',
  '&:hover': {
    backgroundColor: 'primary.dark',
    boxShadow: '0 4px 12px rgba(143, 115, 85, 0.28)',
  },
}

// 登出外框按鈕
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

// 導覽列緊湊版
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

// 導覽列用
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
    '0 -1px 0 rgba(180, 150, 120, 0.06)',
    '0 0 40px rgba(255, 255, 255, 0.12)',
    '0 8px 32px rgba(143, 115, 85, 0.06)',
    '2px 4px 12px rgba(160, 130, 100, 0.05)',
  ].join(', '),
}

// 背景裝飾文字 — 描邊版
export const decorativeTextGlassOutline = {
  ...decorativeTextGlass,
  color: 'transparent',
  WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.24)',
  textShadow: [
    '0 0 24px rgba(255, 255, 255, 0.08)',
    '0 4px 16px rgba(143, 115, 85, 0.04)',
  ].join(', '),
}

// 全頁背景（暖米色系）
export const pageGradient = {
  backgroundColor: '#f5f0e9',
  backgroundImage: `
    radial-gradient(ellipse 75% 55% at 12% 18%, rgba(214, 180, 140, 0.32), transparent),
    radial-gradient(ellipse 65% 50% at 88% 15%, rgba(175, 190, 168, 0.28), transparent),
    radial-gradient(ellipse 60% 45% at 55% 78%, rgba(220, 195, 175, 0.25), transparent),
    radial-gradient(ellipse 45% 40% at 28% 58%, rgba(200, 170, 145, 0.18), transparent),
    linear-gradient(145deg, #faf6f0 0%, #f0e8de 48%, #e6dfd4 100%)
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
