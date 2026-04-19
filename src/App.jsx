import { useState, useEffect, useRef } from "react";

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Jua&family=Noto+Sans+KR:wght@400;700&display=swap');
  * { font-family:'Jua','Noto Sans KR',sans-serif; box-sizing:border-box; }
  input,textarea,button { font-family:'Jua','Noto Sans KR',sans-serif; }
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#f0d8e4;border-radius:4px}
  body { background: #fdf8fb; }

  /* ── 앱 배경: 아주 연한 웜톤 그라디언트 ── */
  .app-bg {
    background:
      linear-gradient(175deg,
        #fff5f8 0%,
        #fef6ff 30%,
        #f5f8ff 60%,
        #f4fdf8 85%,
        #fffbf2 100%
      );
    min-height: 100vh;
    position: relative;
  }

  /* 배경 빛 번짐 - 아주 연하게 */
  .app-bg::before {
    content: '';
    position: fixed;
    top: -80px; left: -60px;
    width: 280px; height: 280px;
    background: radial-gradient(circle, rgba(255,210,228,0.18) 0%, transparent 65%);
    pointer-events: none; z-index: 0;
  }
  .app-bg::after {
    content: '';
    position: fixed;
    bottom: -80px; right: -60px;
    width: 260px; height: 260px;
    background: radial-gradient(circle, rgba(210,225,255,0.15) 0%, transparent 65%);
    pointer-events: none; z-index: 0;
  }

  /* ── 글래스 카드들 ── */
  .glass-card {
    background: rgba(255,255,255,0.78);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.9);
    box-shadow: 0 2px 16px rgba(210,180,200,0.09), 0 1px 4px rgba(0,0,0,0.04);
  }
  .glass-card-pink {
    background: rgba(255,247,251,0.82);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,225,238,0.7);
    box-shadow: 0 2px 14px rgba(240,100,146,0.07);
  }
  .glass-card-blue {
    background: rgba(245,249,255,0.82);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(210,228,255,0.7);
    box-shadow: 0 2px 14px rgba(100,160,240,0.07);
  }
  .glass-card-green {
    background: rgba(246,253,250,0.82);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(200,240,220,0.7);
    box-shadow: 0 2px 14px rgba(80,190,140,0.07);
  }
  .glass-card-yellow {
    background: rgba(255,254,244,0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,244,180,0.65);
    box-shadow: 0 2px 14px rgba(220,180,50,0.06);
  }

  /* 장식 원 */
  .deco-circle-1 {
    position: fixed; top: 80px; right: 10px;
    width: 100px; height: 100px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,210,228,0.14) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .deco-circle-2 {
    position: fixed; top: 42%; left: -20px;
    width: 140px; height: 140px; border-radius: 50%;
    background: radial-gradient(circle, rgba(210,225,255,0.12) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .deco-circle-3 {
    position: fixed; top: 22%; right: -10px;
    width: 90px; height: 90px; border-radius: 50%;
    background: radial-gradient(circle, rgba(200,240,225,0.13) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
`;

// ══════════════════════════════════════════════════════════════
// 기저귀 컴포넌트 (성별별 색상)
// ══════════════════════════════════════════════════════════════
const Diaper = ({ cx, cy, gender = "unknown", w = 36, h = 20 }) => {
  const color = gender === "boy" ? "#90CAF9" : gender === "girl" ? "#F48FB1" : "#FFF9C4";
  const dark  = gender === "boy" ? "#64B5F6" : gender === "girl" ? "#F06292" : "#FFF176";
  return (
    <g>
      {/* 기저귀 몸통 */}
      <ellipse cx={cx} cy={cy} rx={w/2} ry={h/2} fill={color}/>
      {/* 기저귀 테이프 왼쪽 */}
      <rect x={cx - w/2 - 5} y={cy - h/2 + 2} width={8} height={6} rx={2} fill={dark}/>
      {/* 기저귀 테이프 오른쪽 */}
      <rect x={cx + w/2 - 3} y={cy - h/2 + 2} width={8} height={6} rx={2} fill={dark}/>
      {/* 기저귀 중앙 선 */}
      <ellipse cx={cx} cy={cy + 2} rx={w/2 - 6} ry={h/2 - 4} fill={color} opacity="0.5"/>
    </g>
  );
};

// 머리 장식 (성별)
const HairBoy = ({ cx, cy }) => (
  // 뿔처럼 삐죽 솟은 머리카락 한 가닥
  <g>
    <path d={`M${cx-4} ${cy-4} Q${cx} ${cy-18} Q${cx+2} ${cy-14} ${cx+5} ${cy-5}`}
      stroke="#8B6347" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </g>
);

const HairGirl = ({ cx, cy }) => (
  // 리본 + 작은 삐죽머리
  <g>
    {/* 삐죽 머리 2가닥 */}
    <path d={`M${cx-8} ${cy-4} Q${cx-10} ${cy-16} ${cx-5} ${cy-6}`}
      stroke="#8B6347" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d={`M${cx+4} ${cy-5} Q${cx+9} ${cy-16} ${cx+7} ${cy-5}`}
      stroke="#8B6347" strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* 리본 */}
    <ellipse cx={cx+12} cy={cy-8} rx={6} ry={4} fill="#F06292" opacity="0.9" transform={`rotate(-20 ${cx+12} ${cy-8})`}/>
    <ellipse cx={cx+20} cy={cy-12} rx={6} ry={4} fill="#F06292" opacity="0.9" transform={`rotate(20 ${cx+20} ${cy-12})`}/>
    <circle cx={cx+16} cy={cy-10} r={2.5} fill="#E91E63"/>
  </g>
);

// ══════════════════════════════════════════════════════════════
// 탭별 아기 캐릭터
// ══════════════════════════════════════════════════════════════

// 홈 헤더 - 태아 (자궁 속)
const BabyInWomb = ({ size = 90, gender = "unknown" }) => (
  <svg viewBox="0 0 110 110" width={size} height={size}>
    <circle cx="55" cy="56" r="42" fill="#FFF0F5" opacity="0.55"/>
    {/* 몸통 */}
    <ellipse cx="57" cy="68" rx="20" ry="15" fill="#F5E6DA"/>
    {/* 다리 */}
    <ellipse cx="40" cy="78" rx="11" ry="8" fill="#F5E6DA" transform="rotate(-30 40 78)"/>
    <ellipse cx="70" cy="78" rx="11" ry="8" fill="#F5E6DA" transform="rotate(30 70 78)"/>
    {/* 기저귀 */}
    <Diaper cx={57} cy={70} gender={gender} w={32} h={17}/>
    {/* 작은 손 */}
    <circle cx="44" cy="62" r="5" fill="#F5E6DA"/>
    {/* 머리 */}
    <circle cx="57" cy="40" r="24" fill="#F5E6DA"/>
    {/* 성별 머리 장식 */}
    {gender === "boy" && <HairBoy cx={57} cy={18}/>}
    {gender === "girl" && <HairGirl cx={48} cy={18}/>}
    {/* 볼터치 */}
    <ellipse cx="44" cy="43" rx="5.5" ry="3.5" fill="#F2B8A0" opacity="0.65"/>
    <ellipse cx="70" cy="43" rx="5.5" ry="3.5" fill="#F2B8A0" opacity="0.65"/>
    {/* 눈 (반쯤 감음) */}
    <path d="M48 36 Q51 33 54 36" stroke="#5C3D2E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M60 36 Q63 33 66 36" stroke="#5C3D2E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    {/* 코 */}
    <ellipse cx="57" cy="40" rx="2" ry="1.2" fill="#E8A882" opacity="0.5"/>
    {/* 입 */}
    <path d="M52 46 Q57 50 62 46" stroke="#D4896A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    {/* 귀 */}
    <ellipse cx="33" cy="40" rx="4.5" ry="5.5" fill="#F5E6DA"/>
    <ellipse cx="81" cy="40" rx="4.5" ry="5.5" fill="#F5E6DA"/>
    {/* 탯줄 */}
    <path d="M57 83 Q66 92 56 100" stroke="#F2B8A0" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.45"/>
  </svg>
);

// 자고있는 아기 (상태 모르는 경우 - 홈 여정 옆)
const BabySleeping = ({ size = 80, gender = "unknown" }) => (
  <svg viewBox="0 0 100 80" width={size} height={size * 0.8}>
    {/* 몸통 */}
    <ellipse cx="50" cy="60" rx="22" ry="14" fill="#F5E6DA"/>
    {/* 팔 */}
    <ellipse cx="29" cy="57" rx="8" ry="5.5" fill="#F5E6DA" transform="rotate(-20 29 57)"/>
    <ellipse cx="71" cy="57" rx="8" ry="5.5" fill="#F5E6DA" transform="rotate(20 71 57)"/>
    {/* 다리 */}
    <ellipse cx="37" cy="72" rx="10" ry="6" fill="#F5E6DA" transform="rotate(15 37 72)"/>
    <ellipse cx="63" cy="72" rx="10" ry="6" fill="#F5E6DA" transform="rotate(-15 63 72)"/>
    {/* 기저귀 */}
    <Diaper cx={50} cy={62} gender={gender} w={34} h={16}/>
    {/* 머리 */}
    <circle cx="50" cy="30" r="26" fill="#F5E6DA"/>
    {/* 성별 장식 */}
    {gender === "boy" && <HairBoy cx={50} cy={7}/>}
    {gender === "girl" && <HairGirl cx={41} cy={6}/>}
    {/* 볼터치 */}
    <ellipse cx="35" cy="33" rx="6" ry="3.8" fill="#F2B8A0" opacity="0.6"/>
    <ellipse cx="65" cy="33" rx="6" ry="3.8" fill="#F2B8A0" opacity="0.6"/>
    {/* 감은 눈 */}
    <path d="M38 27 Q41 23 44 27" stroke="#5C3D2E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M56 27 Q59 23 62 27" stroke="#5C3D2E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    {/* 코 */}
    <ellipse cx="50" cy="31" rx="2" ry="1.2" fill="#E8A882" opacity="0.5"/>
    {/* 입 */}
    <path d="M45 37 Q50 41 55 37" stroke="#D4896A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    {/* 귀 */}
    <ellipse cx="24" cy="30" rx="4" ry="5" fill="#F5E6DA"/>
    <ellipse cx="76" cy="30" rx="4" ry="5" fill="#F5E6DA"/>
    {/* zzz */}
    <text x="74" y="16" fontSize="9" fill="#C8A882" fontWeight="bold">z</text>
    <text x="80" y="10" fontSize="11" fill="#C8A882" fontWeight="bold">z</text>
    <text x="87" y="4" fontSize="13" fill="#C8A882" fontWeight="bold">z</text>
  </svg>
);

// 책 읽는 아기 (주수 탭)
const BabyReading = ({ size = 80, gender = "unknown" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    {/* 몸통 앉기 */}
    <ellipse cx="50" cy="73" rx="20" ry="14" fill="#F5E6DA"/>
    {/* 다리 */}
    <ellipse cx="35" cy="85" rx="12" ry="7" fill="#F5E6DA" transform="rotate(12 35 85)"/>
    <ellipse cx="65" cy="85" rx="12" ry="7" fill="#F5E6DA" transform="rotate(-12 65 85)"/>
    {/* 기저귀 */}
    <Diaper cx={50} cy={75} gender={gender} w={33} h={16}/>
    {/* 책 */}
    <rect x="28" y="64" width="19" height="13" rx="2" fill="#AED6F1"/>
    <rect x="47" y="64" width="19" height="13" rx="2" fill="#85C1E9"/>
    <line x1="47" y1="64" x2="47" y2="77" stroke="#5D8AA8" strokeWidth="1.2"/>
    {/* 팔 */}
    <ellipse cx="33" cy="69" rx="7" ry="5" fill="#F5E6DA" transform="rotate(22 33 69)"/>
    <ellipse cx="67" cy="69" rx="7" ry="5" fill="#F5E6DA" transform="rotate(-22 67 69)"/>
    {/* 머리 */}
    <circle cx="50" cy="36" r="26" fill="#F5E6DA"/>
    {gender === "boy" && <HairBoy cx={50} cy={12}/>}
    {gender === "girl" && <HairGirl cx={41} cy={11}/>}
    {/* 볼터치 */}
    <ellipse cx="36" cy="39" rx="5.5" ry="3.5" fill="#F2B8A0" opacity="0.6"/>
    <ellipse cx="64" cy="39" rx="5.5" ry="3.5" fill="#F2B8A0" opacity="0.6"/>
    {/* 눈 - 집중 */}
    <circle cx="43" cy="32" r="2.5" fill="#5C3D2E"/>
    <circle cx="57" cy="32" r="2.5" fill="#5C3D2E"/>
    <circle cx="43.9" cy="31.2" r="0.9" fill="white"/>
    <circle cx="57.9" cy="31.2" r="0.9" fill="white"/>
    <ellipse cx="50" cy="36" rx="1.8" ry="1.1" fill="#E8A882" opacity="0.5"/>
    <ellipse cx="50" cy="42" rx="3" ry="2" fill="#D4896A" opacity="0.5"/>
    <ellipse cx="24" cy="36" rx="4" ry="5" fill="#F5E6DA"/>
    <ellipse cx="76" cy="36" rx="4" ry="5" fill="#F5E6DA"/>
  </svg>
);

// 밥 먹는 아기 (음식 탭)
const BabyEating = ({ size = 80, gender = "unknown" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    {/* 몸통 */}
    <ellipse cx="50" cy="73" rx="20" ry="14" fill="#F5E6DA"/>
    {/* 다리 */}
    <ellipse cx="36" cy="85" rx="11" ry="7" fill="#F5E6DA" transform="rotate(8 36 85)"/>
    <ellipse cx="64" cy="85" rx="11" ry="7" fill="#F5E6DA" transform="rotate(-8 64 85)"/>
    {/* 기저귀 */}
    <Diaper cx={50} cy={75} gender={gender} w={33} h={16}/>
    {/* 숟가락 든 팔 */}
    <ellipse cx="30" cy="66" rx="7" ry="5" fill="#F5E6DA" transform="rotate(40 30 66)"/>
    <line x1="25" y1="56" x2="31" y2="68" stroke="#C8A882" strokeWidth="2.2" strokeLinecap="round"/>
    <ellipse cx="24" cy="54" rx="4" ry="3" fill="#C8A882"/>
    {/* 다른 팔 */}
    <ellipse cx="70" cy="66" rx="7" ry="5" fill="#F5E6DA" transform="rotate(-28 70 66)"/>
    {/* 그릇 */}
    <ellipse cx="63" cy="74" rx="11" ry="5" fill="#F0E68C"/>
    <ellipse cx="63" cy="72" rx="11" ry="3.5" fill="#FFFDE7"/>
    <ellipse cx="63" cy="71" rx="9" ry="2.5" fill="white" opacity="0.8"/>
    {/* 머리 */}
    <circle cx="50" cy="36" r="26" fill="#F5E6DA"/>
    {gender === "boy" && <HairBoy cx={50} cy={12}/>}
    {gender === "girl" && <HairGirl cx={41} cy={11}/>}
    {/* 볼터치 - 행복 */}
    <ellipse cx="35" cy="40" rx="6" ry="4" fill="#F2B8A0" opacity="0.75"/>
    <ellipse cx="65" cy="40" rx="6" ry="4" fill="#F2B8A0" opacity="0.75"/>
    {/* 눈 감음 (행복) */}
    <path d="M39 31 Q42 27 45 31" stroke="#5C3D2E" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M55 31 Q58 27 61 31" stroke="#5C3D2E" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <ellipse cx="50" cy="36" rx="1.8" ry="1.1" fill="#E8A882" opacity="0.5"/>
    {/* 입 - O */}
    <ellipse cx="50" cy="43" rx="4" ry="3.5" fill="#D4896A"/>
    <ellipse cx="24" cy="36" rx="4" ry="5" fill="#F5E6DA"/>
    <ellipse cx="76" cy="36" rx="4" ry="5" fill="#F5E6DA"/>
    {/* 냄새선 */}
    <path d="M72 50 Q75 45 72 40" stroke="#F2B8A0" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
    <path d="M77 52 Q80 46 77 42" stroke="#F2B8A0" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.4"/>
  </svg>
);

// 의사 아기 (케어 탭)
const BabyDoctor = ({ size = 80, gender = "unknown" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    {/* 가운 몸통 */}
    <ellipse cx="50" cy="73" rx="21" ry="15" fill="#F0F4FF"/>
    <line x1="50" y1="59" x2="50" y2="86" stroke="#D0D8FF" strokeWidth="1.5"/>
    {/* 다리 */}
    <ellipse cx="36" cy="86" rx="11" ry="7" fill="#F5E6DA" transform="rotate(8 36 86)"/>
    <ellipse cx="64" cy="86" rx="11" ry="7" fill="#F5E6DA" transform="rotate(-8 64 86)"/>
    {/* 기저귀 (가운 밖으로 삐져나옴) */}
    <Diaper cx={50} cy={76} gender={gender} w={30} h={14}/>
    {/* 청진기 */}
    <path d="M34 68 Q27 60 31 52 Q35 44 41 48" stroke="#E74C3C" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <circle cx="42" cy="50" r="4" fill="none" stroke="#E74C3C" strokeWidth="2"/>
    <circle cx="34" cy="70" r="3" fill="#E74C3C"/>
    {/* 팔 */}
    <ellipse cx="30" cy="68" rx="8" ry="5" fill="#F5E6DA" transform="rotate(20 30 68)"/>
    <ellipse cx="70" cy="68" rx="8" ry="5" fill="#F5E6DA" transform="rotate(-20 70 68)"/>
    {/* 머리 */}
    <circle cx="50" cy="35" r="26" fill="#F5E6DA"/>
    {/* 의사 모자 */}
    <rect x="32" y="10" width="36" height="8" rx="3" fill="white" stroke="#D0D8FF" strokeWidth="1"/>
    <rect x="38" y="6" width="24" height="6" rx="3" fill="white" stroke="#D0D8FF" strokeWidth="1"/>
    <line x1="50" y1="10" x2="50" y2="18" stroke="#E74C3C" strokeWidth="1.5"/>
    <line x1="44" y1="14" x2="56" y2="14" stroke="#E74C3C" strokeWidth="1.5"/>
    {/* 성별 장식 (모자 옆) */}
    {gender === "girl" && (
      <g>
        <ellipse cx="66" cy="9" rx="5" ry="3.5" fill="#F48FB1" opacity="0.9" transform="rotate(-20 66 9)"/>
        <ellipse cx="73" cy="5" rx="5" ry="3.5" fill="#F48FB1" opacity="0.9" transform="rotate(20 73 5)"/>
        <circle cx="69" cy="7" r="2" fill="#E91E63"/>
      </g>
    )}
    {gender === "boy" && (
      <path d="M67 8 Q70 0 73 5" stroke="#64B5F6" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    )}
    {/* 볼터치 */}
    <ellipse cx="36" cy="39" rx="5.5" ry="3.5" fill="#F2B8A0" opacity="0.6"/>
    <ellipse cx="64" cy="39" rx="5.5" ry="3.5" fill="#F2B8A0" opacity="0.6"/>
    {/* 눈 */}
    <circle cx="43" cy="32" r="2.5" fill="#5C3D2E"/>
    <circle cx="57" cy="32" r="2.5" fill="#5C3D2E"/>
    <circle cx="43.9" cy="31.2" r="0.9" fill="white"/>
    <circle cx="57.9" cy="31.2" r="0.9" fill="white"/>
    <ellipse cx="50" cy="36" rx="1.8" ry="1.1" fill="#E8A882" opacity="0.5"/>
    <path d="M45 42 Q50 46 55 42" stroke="#D4896A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <ellipse cx="24" cy="35" rx="4" ry="5" fill="#F5E6DA"/>
    <ellipse cx="76" cy="35" rx="4" ry="5" fill="#F5E6DA"/>
  </svg>
);

// 연필 든 아기 (설정 탭)
const BabyWriting = ({ size = 80, gender = "unknown" }) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    {/* 몸통 */}
    <ellipse cx="50" cy="73" rx="20" ry="14" fill="#F5E6DA"/>
    {/* 다리 */}
    <ellipse cx="36" cy="85" rx="11" ry="7" fill="#F5E6DA" transform="rotate(8 36 85)"/>
    <ellipse cx="64" cy="85" rx="11" ry="7" fill="#F5E6DA" transform="rotate(-8 64 85)"/>
    {/* 기저귀 */}
    <Diaper cx={50} cy={75} gender={gender} w={33} h={16}/>
    {/* 노트 */}
    <rect x="52" y="63" width="22" height="17" rx="2" fill="#FFFDE7" stroke="#FFD54F" strokeWidth="1"/>
    <line x1="55" y1="68" x2="71" y2="68" stroke="#FFD54F" strokeWidth="1"/>
    <line x1="55" y1="72" x2="71" y2="72" stroke="#FFD54F" strokeWidth="1"/>
    <line x1="55" y1="76" x2="65" y2="76" stroke="#FFD54F" strokeWidth="1"/>
    {/* 연필 든 팔 */}
    <ellipse cx="66" cy="64" rx="7" ry="5" fill="#F5E6DA" transform="rotate(-40 66 64)"/>
    <rect x="68" y="52" width="4" height="13" rx="1" fill="#FFD54F" transform="rotate(-20 68 52)"/>
    <polygon points="68,65 72,65 70,71" fill="#F5C6A0" transform="rotate(-20 70 65)"/>
    <rect x="68" y="52" width="4" height="3" rx="1" fill="#FF8A80" transform="rotate(-20 68 52)"/>
    {/* 다른 팔 */}
    <ellipse cx="30" cy="68" rx="8" ry="5" fill="#F5E6DA" transform="rotate(15 30 68)"/>
    {/* 머리 */}
    <circle cx="50" cy="35" r="26" fill="#F5E6DA"/>
    {gender === "boy" && <HairBoy cx={50} cy={11}/>}
    {gender === "girl" && <HairGirl cx={41} cy={10}/>}
    {/* 볼터치 */}
    <ellipse cx="36" cy="39" rx="5.5" ry="3.5" fill="#F2B8A0" opacity="0.6"/>
    <ellipse cx="64" cy="39" rx="5.5" ry="3.5" fill="#F2B8A0" opacity="0.6"/>
    {/* 집중 눈썹 */}
    <path d="M39 27 Q42 25 45 27" stroke="#8B6347" strokeWidth="1.3" fill="none"/>
    <path d="M55 27 Q58 25 61 27" stroke="#8B6347" strokeWidth="1.3" fill="none"/>
    {/* 눈 */}
    <circle cx="43" cy="32" r="2.5" fill="#5C3D2E"/>
    <circle cx="57" cy="32" r="2.5" fill="#5C3D2E"/>
    <circle cx="43.9" cy="31.2" r="0.9" fill="white"/>
    <circle cx="57.9" cy="31.2" r="0.9" fill="white"/>
    <ellipse cx="50" cy="36" rx="1.8" ry="1.1" fill="#E8A882" opacity="0.5"/>
    {/* 혀 내밀기 */}
    <path d="M46 42 Q50 45 54 42" stroke="#D4896A" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    <ellipse cx="50" cy="44" rx="3" ry="2" fill="#F4A0A0" opacity="0.7"/>
    <ellipse cx="24" cy="35" rx="4" ry="5" fill="#F5E6DA"/>
    <ellipse cx="76" cy="35" rx="4" ry="5" fill="#F5E6DA"/>
  </svg>
);

// 상태별 아기
const BabyHappy = ({ size = 68, gender = "unknown" }) => (
  <svg viewBox="0 0 90 92" width={size} height={size * 1.02}>
    <ellipse cx="45" cy="70" rx="18" ry="12" fill="#F5E6DA"/>
    <ellipse cx="31" cy="80" rx="10" ry="6" fill="#F5E6DA" transform="rotate(10 31 80)"/>
    <ellipse cx="59" cy="80" rx="10" ry="6" fill="#F5E6DA" transform="rotate(-10 59 80)"/>
    <ellipse cx="27" cy="65" rx="7" ry="5" fill="#F5E6DA" transform="rotate(18 27 65)"/>
    <ellipse cx="63" cy="65" rx="7" ry="5" fill="#F5E6DA" transform="rotate(-18 63 65)"/>
    <Diaper cx={45} cy={72} gender={gender} w={30} h={14}/>
    <circle cx="45" cy="30" r="24" fill="#F5E6DA"/>
    {gender === "boy" && <HairBoy cx={45} cy={8}/>}
    {gender === "girl" && <HairGirl cx={36} cy={7}/>}
    <ellipse cx="32" cy="34" rx="6" ry="3.8" fill="#F2B8A0" opacity="0.75"/>
    <ellipse cx="58" cy="34" rx="6" ry="3.8" fill="#F2B8A0" opacity="0.75"/>
    <path d="M36 26 Q39 22 42 26" stroke="#5C3D2E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M48 26 Q51 22 54 26" stroke="#5C3D2E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <ellipse cx="45" cy="30" rx="1.7" ry="1.1" fill="#E8A882" opacity="0.5"/>
    <path d="M38 38 Q45 44 52 38" stroke="#D4896A" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <ellipse cx="21" cy="30" rx="4" ry="5" fill="#F5E6DA"/>
    <ellipse cx="69" cy="30" rx="4" ry="5" fill="#F5E6DA"/>
    <text x="60" y="14" fontSize="10">✨</text>
    <text x="12" y="14" fontSize="10">✨</text>
  </svg>
);

const BabySick = ({ size = 68, gender = "unknown" }) => (
  <svg viewBox="0 0 90 92" width={size} height={size * 1.02}>
    <ellipse cx="45" cy="70" rx="18" ry="12" fill="#F0EDDA"/>
    <ellipse cx="31" cy="80" rx="10" ry="6" fill="#F0EDDA" transform="rotate(10 31 80)"/>
    <ellipse cx="59" cy="80" rx="10" ry="6" fill="#F0EDDA" transform="rotate(-10 59 80)"/>
    <ellipse cx="27" cy="65" rx="7" ry="5" fill="#F0EDDA" transform="rotate(18 27 65)"/>
    <ellipse cx="63" cy="65" rx="7" ry="5" fill="#F0EDDA" transform="rotate(-18 63 65)"/>
    <Diaper cx={45} cy={72} gender={gender} w={30} h={14}/>
    <circle cx="45" cy="30" r="24" fill="#F0EDDA"/>
    {gender === "boy" && <HairBoy cx={45} cy={8}/>}
    {gender === "girl" && <HairGirl cx={36} cy={7}/>}
    <ellipse cx="32" cy="35" rx="5" ry="3" fill="#B2DFDB" opacity="0.65"/>
    <ellipse cx="58" cy="35" rx="5" ry="3" fill="#B2DFDB" opacity="0.65"/>
    <path d="M34 23 Q37 20 40 22" stroke="#8B6347" strokeWidth="1.5" fill="none"/>
    <path d="M50 22 Q53 20 56 23" stroke="#8B6347" strokeWidth="1.5" fill="none"/>
    <path d="M35 28 Q38 25 41 28" stroke="#5C3D2E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M49 28 Q52 25 55 28" stroke="#5C3D2E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <ellipse cx="45" cy="32" rx="1.7" ry="1.1" fill="#E8A882" opacity="0.5"/>
    <path d="M40 39 Q45 36 50 39" stroke="#D4896A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <ellipse cx="21" cy="30" rx="4" ry="5" fill="#F0EDDA"/>
    <ellipse cx="69" cy="30" rx="4" ry="5" fill="#F0EDDA"/>
    <ellipse cx="66" cy="19" rx="2.5" ry="3.5" fill="#AED6F1" opacity="0.75"/>
  </svg>
);

const BabyNeutral = ({ size = 68, gender = "unknown" }) => (
  <svg viewBox="0 0 90 92" width={size} height={size * 1.02}>
    <ellipse cx="45" cy="70" rx="18" ry="12" fill="#F5E6DA"/>
    <ellipse cx="31" cy="80" rx="10" ry="6" fill="#F5E6DA" transform="rotate(10 31 80)"/>
    <ellipse cx="59" cy="80" rx="10" ry="6" fill="#F5E6DA" transform="rotate(-10 59 80)"/>
    <ellipse cx="27" cy="65" rx="7" ry="5" fill="#F5E6DA" transform="rotate(18 27 65)"/>
    <ellipse cx="63" cy="65" rx="7" ry="5" fill="#F5E6DA" transform="rotate(-18 63 65)"/>
    <Diaper cx={45} cy={72} gender={gender} w={30} h={14}/>
    <circle cx="45" cy="30" r="24" fill="#F5E6DA"/>
    {gender === "boy" && <HairBoy cx={45} cy={8}/>}
    {gender === "girl" && <HairGirl cx={36} cy={7}/>}
    <ellipse cx="32" cy="34" rx="5.5" ry="3.5" fill="#F2B8A0" opacity="0.5"/>
    <ellipse cx="58" cy="34" rx="5.5" ry="3.5" fill="#F2B8A0" opacity="0.5"/>
    <circle cx="39" cy="28" r="2.3" fill="#5C3D2E"/>
    <circle cx="51" cy="28" r="2.3" fill="#5C3D2E"/>
    <circle cx="39.9" cy="27.2" r="0.8" fill="white"/>
    <circle cx="51.9" cy="27.2" r="0.8" fill="white"/>
    <ellipse cx="45" cy="32" rx="1.7" ry="1.1" fill="#E8A882" opacity="0.5"/>
    <path d="M40 38 Q45 41 50 38" stroke="#D4896A" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    <ellipse cx="21" cy="30" rx="4" ry="5" fill="#F5E6DA"/>
    <ellipse cx="69" cy="30" rx="4" ry="5" fill="#F5E6DA"/>
  </svg>
);

// ══════════════════════════════════════════════════════════════
// 데이터
// ══════════════════════════════════════════════════════════════
const WEEKLY_DATA = {
  4:{size:"양귀비씨",emoji:"🌱",sizeCm:"0.2cm",babyDesc:"심장이 뛰기 시작해요",momDesc:"착상 완료! 임신 테스트 가능해요"},
  5:{size:"참깨",emoji:"🌿",sizeCm:"0.4cm",babyDesc:"뇌와 척수가 형성되고 있어요",momDesc:"입덧이 시작될 수 있어요"},
  6:{size:"렌틸콩",emoji:"🫘",sizeCm:"0.6cm",babyDesc:"팔다리 싹이 생겨요",momDesc:"가슴이 예민해지고 피로감이 심해져요"},
  7:{size:"블루베리",emoji:"🫐",sizeCm:"1.3cm",babyDesc:"얼굴 윤곽이 생기기 시작해요",momDesc:"입덧이 가장 심한 시기예요"},
  8:{size:"강낭콩",emoji:"🫘",sizeCm:"1.6cm",babyDesc:"손가락 발가락이 생겨요",momDesc:"자궁이 주먹만해졌어요"},
  9:{size:"포도",emoji:"🍇",sizeCm:"2.3cm",babyDesc:"주요 장기가 형성 중이에요",momDesc:"체중이 조금씩 늘기 시작해요"},
  10:{size:"딸기",emoji:"🍓",sizeCm:"3.1cm",babyDesc:"손발가락이 완전히 분리돼요",momDesc:"입덧이 서서히 줄어들 수 있어요"},
  11:{size:"무화과",emoji:"🍑",sizeCm:"4.1cm",babyDesc:"귀가 완성돼 소리를 들어요",momDesc:"배가 조금씩 나오기 시작해요"},
  12:{size:"라임",emoji:"🟢",sizeCm:"5.4cm",babyDesc:"손가락 지문이 생겨요",momDesc:"1분기 끝! 유산 위험이 크게 줄어요"},
  13:{size:"완두콩꼬투리",emoji:"🫛",sizeCm:"7.4cm",babyDesc:"성별 구분이 시작돼요",momDesc:"입덧이 거의 사라지는 시기예요"},
  14:{size:"복숭아",emoji:"🍑",sizeCm:"8.7cm",babyDesc:"표정을 짓고 엄지를 빨 수 있어요",momDesc:"에너지가 돌아오는 황금기예요"},
  15:{size:"오렌지",emoji:"🍊",sizeCm:"10.1cm",babyDesc:"빛을 감지하기 시작해요",momDesc:"태동을 처음 느낄 수 있어요"},
  16:{size:"아보카도",emoji:"🥑",sizeCm:"11.6cm",babyDesc:"눈을 움직일 수 있어요",momDesc:"배가 확실히 나오기 시작해요"},
  17:{size:"순무",emoji:"🥔",sizeCm:"13cm",babyDesc:"지방이 쌓이기 시작해요",momDesc:"허리 통증이 생길 수 있어요"},
  18:{size:"피망",emoji:"🫑",sizeCm:"14.2cm",babyDesc:"하품·딸꾹질을 해요",momDesc:"태동이 확실하게 느껴져요"},
  19:{size:"망고",emoji:"🥭",sizeCm:"15.3cm",babyDesc:"태지(하얀 코팅)가 생겨요",momDesc:"배꼽이 볼록 튀어나올 수 있어요"},
  20:{size:"바나나",emoji:"🍌",sizeCm:"16.4cm",babyDesc:"절반! 태동이 활발해요",momDesc:"정밀 초음파 검사 시기예요"},
  21:{size:"당근",emoji:"🥕",sizeCm:"26.7cm",babyDesc:"눈썹과 속눈썹이 생겨요",momDesc:"소화불량이 심해질 수 있어요"},
  22:{size:"파파야",emoji:"🍈",sizeCm:"27.8cm",babyDesc:"잠자고 깨는 패턴이 생겨요",momDesc:"발목 부종이 생길 수 있어요"},
  23:{size:"자몽",emoji:"🍊",sizeCm:"28.9cm",babyDesc:"청각 발달, 목소리를 들어요",momDesc:"임신성 당뇨 검사 시기예요"},
  24:{size:"옥수수",emoji:"🌽",sizeCm:"30cm",babyDesc:"폐가 발달하기 시작해요",momDesc:"하지정맥류가 생길 수 있어요"},
  25:{size:"콜리플라워",emoji:"🥦",sizeCm:"34.6cm",babyDesc:"손을 쥐었다 펼 수 있어요",momDesc:"뱃가죽이 당기고 가려울 수 있어요"},
  26:{size:"상추",emoji:"🥬",sizeCm:"35.6cm",babyDesc:"눈을 뜨고 감을 수 있어요",momDesc:"수면이 불편해지기 시작해요"},
  27:{size:"가지",emoji:"🍆",sizeCm:"36.6cm",babyDesc:"뇌가 빠르게 발달해요",momDesc:"3분기 시작! 조기 진통 주의"},
  28:{size:"큰가지",emoji:"🍆",sizeCm:"37.6cm",babyDesc:"눈이 빛에 반응해요",momDesc:"빈혈 검사가 필요한 시기예요"},
  29:{size:"호박",emoji:"🎃",sizeCm:"38.6cm",babyDesc:"뼈가 단단해지고 있어요",momDesc:"숨이 차고 답답할 수 있어요"},
  30:{size:"양배추",emoji:"🥬",sizeCm:"39.9cm",babyDesc:"손톱이 완성돼요",momDesc:"머리가 아래로 향하기 시작해요"},
  31:{size:"코코넛",emoji:"🥥",sizeCm:"41.1cm",babyDesc:"모든 감각이 발달했어요",momDesc:"숨참기가 심해질 수 있어요"},
  32:{size:"배",emoji:"🍐",sizeCm:"42.4cm",babyDesc:"체온 조절 능력이 생겨요",momDesc:"분만 방법 상담 시작이에요"},
  33:{size:"파인애플",emoji:"🍍",sizeCm:"43.7cm",babyDesc:"뼈가 더욱 단단해져요",momDesc:"골반 압박감이 심해질 수 있어요"},
  34:{size:"멜론",emoji:"🍈",sizeCm:"45cm",babyDesc:"면역 항체를 받기 시작해요",momDesc:"태동 측정을 꼭 하세요"},
  35:{size:"허니듀멜론",emoji:"🍈",sizeCm:"46.2cm",babyDesc:"신장이 완전히 발달했어요",momDesc:"분만 준비를 시작할 때예요"},
  36:{size:"로마멜론",emoji:"🍈",sizeCm:"47.4cm",babyDesc:"머리가 골반 안으로 내려와요",momDesc:"매주 검진으로 바뀌어요"},
  37:{size:"큰멜론",emoji:"🍈",sizeCm:"48.6cm",babyDesc:"언제든 출산 가능해요",momDesc:"분만 징후를 잘 살펴야 해요"},
  38:{size:"작은수박",emoji:"🍉",sizeCm:"49.8cm",babyDesc:"모든 장기가 완성됐어요",momDesc:"언제 태어나도 건강한 시기예요"},
  39:{size:"수박",emoji:"🍉",sizeCm:"50.7cm",babyDesc:"출산 준비 완료!",momDesc:"진통 간격을 재기 시작하세요"},
  40:{size:"큰수박",emoji:"🍉",sizeCm:"51.2cm",babyDesc:"출산 예정일! 곧 만나요 💕",momDesc:"언제든 연락할 수 있게 준비해두세요"},
};

const SYMPTOM_GROUPS = [
  {group:"🤢 입덧·소화",color:"#66BB6A",bg:"#F1F8E9",items:[
    {id:"nausea_mild",label:"입덧 조금",emoji:"😐",sev:1},{id:"nausea_mid",label:"입덧 심함",emoji:"🤢",sev:3},
    {id:"nausea_severe",label:"입덧 매우 심함",emoji:"🤮",sev:5},{id:"no_appetite",label:"입맛 없음",emoji:"🍽️",sev:3},
    {id:"smell",label:"냄새 역함",emoji:"👃",sev:3},{id:"heartburn",label:"속쓰림",emoji:"🔥",sev:2},
    {id:"bloating",label:"더부룩함",emoji:"🫃",sev:2},{id:"constipation",label:"변비",emoji:"😣",sev:2},
    {id:"vomited",label:"구토함",emoji:"🚽",sev:5},{id:"cant_eat",label:"밥 거의 못먹음",emoji:"😶",sev:4},
  ]},
  {group:"🔴 통증·불편함",color:"#EF9A9A",bg:"#FFF3F3",items:[
    {id:"back_mild",label:"허리 뻐근함",emoji:"🔶",sev:2},{id:"back_severe",label:"허리 많이 아픔",emoji:"🔴",sev:4},
    {id:"headache",label:"두통",emoji:"🤕",sev:3},{id:"pelvic",label:"골반 통증",emoji:"😖",sev:3},
    {id:"leg_cramp",label:"다리 쥐남",emoji:"🦵",sev:3},{id:"swelling",label:"부종",emoji:"🦶",sev:2},
    {id:"breast_pain",label:"가슴 통증",emoji:"💢",sev:2},{id:"belly_pull",label:"배 당김",emoji:"🪢",sev:2},
  ]},
  {group:"😴 피로·수면",color:"#9575CD",bg:"#F5F0FF",items:[
    {id:"tired_mild",label:"조금 피곤함",emoji:"😪",sev:1},{id:"tired_severe",label:"많이 지침",emoji:"😴",sev:3},
    {id:"insomnia",label:"잠 못 잠",emoji:"🌙",sev:3},{id:"dizzy",label:"어지러움",emoji:"💫",sev:3},
    {id:"shortbreath",label:"숨참",emoji:"😮‍💨",sev:2},{id:"no_water",label:"물도 못 마심",emoji:"💧",sev:5},
  ]},
  {group:"💕 기분·마음",color:"#F06292",bg:"#FFF0F5",items:[
    {id:"good",label:"컨디션 좋음",emoji:"😊",sev:0},{id:"happy",label:"기분 좋음",emoji:"💕",sev:0},
    {id:"anxious",label:"불안함",emoji:"😟",sev:2},{id:"mood_swing",label:"감정 기복",emoji:"🎢",sev:2},
    {id:"lonely",label:"외로움",emoji:"🥺",sev:2},{id:"stay_home",label:"방에만 있음",emoji:"🏠",sev:1},
    {id:"want_call",label:"연락 원함",emoji:"📞",sev:1},{id:"dont_disturb",label:"혼자 있고싶음",emoji:"🤫",sev:1},
    {id:"crying",label:"눈물이 남",emoji:"😭",sev:2},{id:"want_shopping",label:"백화점 가고싶음",emoji:"🛍️",sev:0},
  ]},
  {group:"🍱 식욕·음식",color:"#FFB300",bg:"#FFFDE7",items:[
    {id:"hungry",label:"식욕 왕성",emoji:"😋",sev:0},{id:"craving",label:"특정 음식 당김",emoji:"🤤",sev:0},
    {id:"so_hungry",label:"배가 너무 고픔",emoji:"🍚",sev:1},{id:"want_cola",label:"콜라가 너무 땡김",emoji:"🥤",sev:1},
    {id:"no_drink",label:"음료 거부",emoji:"🚫",sev:3},{id:"only_one",label:"한 가지만 먹힘",emoji:"🥢",sev:2},
  ]},
];
const ALL_SYM = SYMPTOM_GROUPS.flatMap(g=>g.items);
const calcSev = (c) => {
  if(!c?.length) return 0;
  const s=c.map(id=>ALL_SYM.find(x=>x.id===id)?.sev||0);
  return Math.min(5,Math.round(Math.max(...s)*0.6+(s.reduce((a,b)=>a+b,0)/s.length)*0.4));
};
const SEV_INFO = [
  {label:"오늘 상태 미기록",color:"#BDBDBD",bg:"#F5F5F5",msg:"아직 오늘 상태를 기록하지 않았어요",action:""},
  {label:"😊 컨디션 매우 좋음",color:"#43A047",bg:"#E8F5E9",msg:"컨디션이 아주 좋은 날이에요! 편하게 연락해도 좋아요",action:""},
  {label:"🙂 괜찮은 편",color:"#7CB342",bg:"#F1F8E9",msg:"비교적 괜찮은 편이에요. 따뜻한 문자 어때요? 💌",action:""},
  {label:"😐 조금 불편함",color:"#FB8C00",bg:"#FFF8E1",msg:"불편한 증상이 있어요. 필요한 게 있는지 물어봐 주세요 🙏",action:""},
  {label:"😢 많이 힘듦",color:"#E53935",bg:"#FFF3F3",msg:"많이 힘든 날이에요. 직접 챙겨주거나 전화해 주세요 📞",action:"📞 전화나 방문을 추천해요"},
  {label:"🆘 매우 힘들어요",color:"#B71C1C",bg:"#FFEBEE",msg:"매우 힘든 상태예요! 지금 바로 연락하거나 옆에 있어주세요 ❤️‍🩹",action:"🚨 지금 당장 연락이 필요해요!"},
];

const FOOD_ITEMS = [
  // 🥩 단백질
  {id:"chicken",  cat:"🥩 단백질", emoji:"🍗", name:"닭가슴살·닭고기",    tip:"완전히 익혀서 드세요. 고단백 저지방으로 최고!", badge:"단백질"},
  {id:"beef",     cat:"🥩 단백질", emoji:"🥩", name:"소고기·돼지고기",    tip:"완조리 필수. 철분+단백질 두 마리 토끼!", badge:"철분"},
  {id:"tofu",     cat:"🥩 단백질", emoji:"🫘", name:"두부·콩·검은콩",     tip:"식물성 단백질. 입덧 중에도 잘 넘어가요", badge:"단백질"},
  {id:"egg",      cat:"🥩 단백질", emoji:"🥚", name:"달걀 (완숙)",        tip:"완숙으로만! 반숙은 살모넬라균 위험", badge:"단백질"},
  {id:"salmon",   cat:"🥩 단백질", emoji:"🐟", name:"연어·고등어 (조리)", tip:"오메가3 DHA 풍부. 반드시 익혀서", badge:"오메가3"},
  {id:"shrimp",   cat:"🥩 단백질", emoji:"🦐", name:"새우·조개 (완조리)", tip:"아연·철분 풍부. 완전히 익혀야 안전", badge:"철분"},
  // 🥛 유제품
  {id:"milk",     cat:"🥛 유제품", emoji:"🥛", name:"우유 (저온살균)",    tip:"하루 2잔 권장. 칼슘의 왕!", badge:"칼슘"},
  {id:"yogurt",   cat:"🥛 유제품", emoji:"🫙", name:"플레인 요거트",      tip:"유산균+칼슘. 변비에도 도움", badge:"유산균"},
  {id:"cheese",   cat:"🥛 유제품", emoji:"🧀", name:"체다·모짜렐라 치즈", tip:"가열된 치즈는 OK. 블루치즈는 금지!", badge:"칼슘"},
  // 🥦 채소
  {id:"spinach",  cat:"🥦 채소",   emoji:"🥬", name:"시금치",             tip:"엽산+철분의 보고. 살짝 볶아 드세요", badge:"엽산"},
  {id:"broccoli", cat:"🥦 채소",   emoji:"🥦", name:"브로콜리·케일",      tip:"엽산+비타민C+칼슘 삼박자!", badge:"엽산"},
  {id:"sweetp",   cat:"🥦 채소",   emoji:"🍠", name:"고구마",             tip:"비타민A·식이섬유. 변비 해결사", badge:"비타민"},
  {id:"carrot",   cat:"🥦 채소",   emoji:"🥕", name:"당근",               tip:"베타카로틴 풍부. 태아 눈 발달에 좋아요", badge:"비타민"},
  {id:"corn",     cat:"🥦 채소",   emoji:"🌽", name:"옥수수·완두콩",      tip:"식이섬유+엽산. 적당량 섭취", badge:"엽산"},
  {id:"tomato",   cat:"🥦 채소",   emoji:"🍅", name:"토마토·파프리카",    tip:"라이코펜+비타민C. 항산화 효과", badge:"비타민"},
  // 🍎 과일
  {id:"banana",   cat:"🍎 과일",   emoji:"🍌", name:"바나나",             tip:"칼륨+마그네슘. 다리 쥐날 때 도움", badge:"칼륨"},
  {id:"berry",    cat:"🍎 과일",   emoji:"🍓", name:"딸기·블루베리",      tip:"비타민C+항산화. 면역력 UP", badge:"비타민"},
  {id:"avocado",  cat:"🍎 과일",   emoji:"🥑", name:"아보카도",           tip:"엽산+불포화지방. 아기 뇌 발달에 최고", badge:"엽산"},
  {id:"orange",   cat:"🍎 과일",   emoji:"🍊", name:"오렌지·귤·자몽",    tip:"비타민C+엽산. 철분 흡수 도움", badge:"비타민"},
  {id:"kiwi",     cat:"🍎 과일",   emoji:"🥝", name:"키위",               tip:"엽산 풍부+비타민C. 임신 중 추천", badge:"엽산"},
  {id:"apple",    cat:"🍎 과일",   emoji:"🍎", name:"사과",               tip:"식이섬유+사과산. 소화 도움", badge:"식이섬유"},
  // 🌾 탄수화물
  {id:"brownrice",cat:"🌾 탄수화물",emoji:"🍚", name:"현미밥·잡곡밥",    tip:"혈당 조절+식이섬유. 백미보다 훨씬 좋아요", badge:"식이섬유"},
  {id:"oatmeal",  cat:"🌾 탄수화물",emoji:"🥣", name:"오트밀",            tip:"입덧 중 아침식사로 딱! 포만감 오래 지속", badge:"식이섬유"},
  {id:"bread",    cat:"🌾 탄수화물",emoji:"🍞", name:"통밀빵·호밀빵",     tip:"정제 탄수화물보다 혈당 안정적", badge:"식이섬유"},
  {id:"potato",   cat:"🌾 탄수화물",emoji:"🥔", name:"감자",              tip:"비타민C+칼륨. 쪄 먹으면 최고", badge:"비타민"},
  // 🫐 간식
  {id:"nut",      cat:"🫐 간식",   emoji:"🥜", name:"호두·아몬드·캐슈너트",tip:"오메가3+비타민E. 하루 한 줌 권장", badge:"오메가3"},
  {id:"dried",    cat:"🫐 간식",   emoji:"🍇", name:"말린 자두·대추·무화과",tip:"철분+칼슘. 변비에도 효과적", badge:"철분"},
  {id:"cracker",  cat:"🫐 간식",   emoji:"🍘", name:"크래커·쌀과자",      tip:"입덧 심할 때 공복에 먹으면 도움", badge:"탄수화물"},
  {id:"darkchoc", cat:"🫐 간식",   emoji:"🍫", name:"다크초콜릿 (소량)",  tip:"철분+마그네슘. 70% 이상, 소량만", badge:"철분"},
  {id:"smoothie", cat:"🫐 간식",   emoji:"🥤", name:"과일 스무디",        tip:"비타민+수분 보충. 당분 과다 주의", badge:"비타민"},
  // ⚠️ 주의
  {id:"caffeine", cat:"⚠️ 주의",  emoji:"☕", name:"커피·녹차·에너지음료",tip:"하루 카페인 200mg 이하로 제한 (커피 1잔)", warn:true},
  {id:"cola",     cat:"⚠️ 주의",  emoji:"🥤", name:"콜라·탄산음료",      tip:"카페인+당분 높아요. 콜라 1캔=카페인 34mg", warn:true},
  {id:"tuna",     cat:"⚠️ 주의",  emoji:"🐟", name:"참치 (대형)",        tip:"수은 함량 높아 주 1회 이하로 제한", warn:true},
  {id:"deli",     cat:"⚠️ 주의",  emoji:"🌭", name:"햄·소시지·훈제 육류", tip:"아질산나트륨 함유. 가끔만, 가열해서", warn:true},
  {id:"spicy",    cat:"⚠️ 주의",  emoji:"🌶️", name:"매운 음식",          tip:"과도한 자극으로 위장장애 유발 가능", warn:true},
  {id:"instant",  cat:"⚠️ 주의",  emoji:"🍜", name:"라면·인스턴트식품",  tip:"나트륨·식품첨가물 과다. 최소화 권장", warn:true},
  // 🚫 금지
  {id:"rawmeat",  cat:"🚫 금지",  emoji:"🥩", name:"날고기·육회·순대",   tip:"리스테리아균·독소플라스마 위험. 반드시 완조리", danger:true},
  {id:"sashimi",  cat:"🚫 금지",  emoji:"🐟", name:"생선회·굴·조개 (날것)",tip:"노로바이러스·비브리오균 위험", danger:true},
  {id:"rawegg",   cat:"🚫 금지",  emoji:"🥚", name:"날달걀·반숙달걀",    tip:"살모넬라균 위험. 완숙으로만", danger:true},
  {id:"softcheese",cat:"🚫 금지", emoji:"🧀", name:"블루치즈·브리·까망베르",tip:"리스테리아균 위험. 가열 안 된 연성 치즈", danger:true},
  {id:"alcohol",  cat:"🚫 금지",  emoji:"🍺", name:"술·알코올",           tip:"태아 알코올 증후군 유발. 소량도 절대 금지!", danger:true},
  {id:"rawsprout",cat:"🚫 금지",  emoji:"🌱", name:"날콩나물·새싹채소",  tip:"세균 오염 위험. 반드시 익혀서", danger:true},
];

const CHECKLIST = [
  {id:"folic",label:"엽산 섭취했어요",emoji:"💊",cat:"영양"},
  {id:"iron",label:"철분제 먹었어요",emoji:"🔴",cat:"영양"},
  {id:"water",label:"물 1.5L 이상 마셨어요",emoji:"💧",cat:"수분"},
  {id:"walk",label:"가벼운 산책 했어요",emoji:"🚶",cat:"운동"},
  {id:"sleep",label:"충분히 잤어요",emoji:"😴",cat:"수면"},
  {id:"no_caffeine",label:"카페인 피했어요",emoji:"☕",cat:"식습관"},
  {id:"kegel",label:"케겔 운동 했어요",emoji:"🤸",cat:"운동"},
  {id:"posture",label:"올바른 자세 유지했어요",emoji:"🧍",cat:"생활"},
  {id:"kick",label:"태동 느꼈어요",emoji:"👶",cat:"아기"},
  {id:"hospital",label:"병원 예약 확인했어요",emoji:"🏥",cat:"병원"},
];

// 임산부 금지·주의사항 (출처: 아이사랑 임신육아종합포털, 서울시민 건강포털, 하이닥)
const CAUTION_LIST = [
  {
    cat:"🚫 절대 금지",
    color:"#E53935", bg:"rgba(255,235,235,0.8)", border:"rgba(229,57,53,0.25)",
    items:[
      {emoji:"🍺", title:"음주·알코올", desc:"태아 알코올 증후군 유발. 소량도 절대 안돼요. 뇌 기형·심장 기형 위험"},
      {emoji:"🚬", title:"흡연·간접흡연", desc:"유산·태반조기박리·저체중아 원인. 간접흡연도 피해야 해요"},
      {emoji:"💊", title:"임의 약물 복용", desc:"의사 처방 없이 감기약·진통제·한약 복용 금지. 반드시 산부인과 상담"},
      {emoji:"🛁", title:"뜨거운 탕욕·사우나 (45℃↑)", desc:"태아 뇌·척수 손상, 실신 위험. 38℃ 이하 미온수 반신욕만 허용"},
      {emoji:"💉", title:"예방접종 (생백신)", desc:"수두·MMR 등 생백신은 임신 중 금지. 독감·Tdap 등은 접종 권장"},
    ]
  },
  {
    cat:"⚠️ 자세·생활 주의",
    color:"#FB8C00", bg:"rgba(255,248,230,0.8)", border:"rgba(251,140,0,0.25)",
    items:[
      {emoji:"👠", title:"굽 높은 신발 착용 금지", desc:"중심 잡기 어려워 낙상 위험. 굽 낮고 미끄럼 방지 신발을 신으세요"},
      {emoji:"🧎", title:"쪼그려 앉는 자세 금지", desc:"자궁 압박 유발. 걸레질 시 네 발로 기는 자세로 대체"},
      {emoji:"🏋️", title:"무거운 물건 들기 금지", desc:"복압 상승으로 유산·조산 위험. 5kg 이상은 다른 사람에게 부탁"},
      {emoji:"🛏️", title:"똑바로 누워 자기 자제 (중기 이후)", desc:"자궁이 대동맥 압박 → 태아에 산소 감소. 왼쪽으로 눕는 자세 권장"},
      {emoji:"🧴", title:"화학성분 강한 청소제·살충제", desc:"유기용제·살충제 흡입은 태아에 위험. 환기 철저, 장갑 착용"},
      {emoji:"🐱", title:"고양이 배변 처리 주의", desc:"독소플라스마증 위험. 고양이 화장실은 다른 사람이 처리하는 게 좋아요"},
      {emoji:"🌡️", title:"고열 방치 금지", desc:"38℃ 이상 고열이 3일 이상 지속되면 신경관 결손 위험. 즉시 병원 방문"},
      {emoji:"🏊", title:"과격한 운동 금지", desc:"배구·축구·스키·낙상 위험 운동 금지. 수영·걷기·임산부 요가는 권장"},
    ]
  },
  {
    cat:"🚗 이동·외출 주의",
    color:"#7B1FA2", bg:"rgba(248,240,255,0.8)", border:"rgba(123,31,162,0.2)",
    items:[
      {emoji:"🚗", title:"안전벨트는 반드시 착용", desc:"배 위아래로 걸쳐 착용. 에어백도 태아에 위험하지 않아요"},
      {emoji:"✈️", title:"장거리 비행 주의 (36주 이후 금지)", desc:"장시간 같은 자세는 혈전 위험. 1~2시간마다 스트레칭 필수"},
      {emoji:"❄️", title:"겨울철 낙상 주의", desc:"배가 나오면 대처 속도 느려져 미끄러지기 쉬워요. 미끄럼 방지 신발 필수"},
      {emoji:"🌞", title:"장시간 직사광선 노출 자제", desc:"과도한 열 노출은 체온 상승 유발. 자외선 차단제 사용 권장"},
    ]
  },
  {
    cat:"😴 수면·휴식 관리",
    color:"#1976D2", bg:"rgba(235,245,255,0.8)", border:"rgba(25,118,210,0.2)",
    items:[
      {emoji:"🛌", title:"하루 8~9시간 수면 권장", desc:"태아 성장을 돕고 임신 트러블 감소. 규칙적인 취침 시간 유지"},
      {emoji:"🌙", title:"낮잠은 15~30분으로 제한", desc:"오후 늦은 낮잠·1시간 이상 낮잠은 밤잠 방해. 짧게만 자세요"},
      {emoji:"🧘", title:"극심한 스트레스 주의", desc:"과도한 스트레스는 유산·조산 유발 가능. 명상·가벼운 산책으로 해소"},
      {emoji:"📱", title:"취침 전 스마트폰·블루라이트 자제", desc:"수면의 질 저하. 취침 1시간 전 화면 끄기 권장"},
    ]
  },
  {
    cat:"🏥 즉시 병원 가야 할 증상",
    color:"#C62828", bg:"rgba(255,230,230,0.85)", border:"rgba(198,40,40,0.3)",
    items:[
      {emoji:"🩸", title:"질 출혈이 있을 때", desc:"소량이라도 출혈이 있으면 즉시 산부인과 방문. 자연유산·전치태반 신호일 수 있어요"},
      {emoji:"💧", title:"양수가 흐르는 느낌", desc:"소량의 액체가 계속 나오면 조기 양막파수 가능성. 즉시 병원으로"},
      {emoji:"🤕", title:"심한 복통·규칙적인 진통", desc:"조산 신호일 수 있어요. 10분 간격 이하 진통은 즉시 병원"},
      {emoji:"👁️", title:"갑작스러운 시야 흐림·심한 두통", desc:"임신중독증 신호. 혈압 상승·부종과 함께 나타나면 응급"},
      {emoji:"🦶", title:"갑작스러운 심한 부종", desc:"얼굴·손·발이 갑자기 심하게 붓는 경우 임신중독증 의심. 즉시 검진"},
    ]
  },
];

const DEFAULT = {week:16,gender:"unknown",dueDate:"",babyName:"",momName:"",conditions:[],pin:"1234",isUnlocked:false,memo:"",foodRatings:{},hospital:null,checkToday:{},checkDate:"",photos:[],appointments:[],familyCode:null,followingFamilies:[]};

// ── 팔로잉 가족 보기 화면 ───────────────────────────────────
function FollowingView({data, code, onBack}) {
  const w = data.week || 8;
  const wd = WEEKLY_DATA[w] || WEEKLY_DATA[16];
  const sev = calcSev(data.conditions||[]);
  const info = SEV_INFO[sev];
  const active = ALL_SYM.filter(s=>(data.conditions||[]).includes(s.id));
  const g = data.gender || "unknown";
  const daysLeft = data.dueDate ? Math.max(0, Math.round((new Date(data.dueDate)-new Date())/86400000)) : null;
  const today = new Date().toISOString().split("T")[0];
  const nextAppt = (data.appointments||[]).filter(a=>a.date>=today).sort((a,b)=>a.date.localeCompare(b.date))[0];

  return (
    <div style={{paddingBottom:"2rem"}}>
      {/* 뒤로가기 헤더 */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.7)",border:"1px solid rgba(240,98,146,0.2)",borderRadius:12,padding:"6px 12px",fontSize:12,color:"#f06292",cursor:"pointer",fontWeight:700}}>
          ← 내 가족
        </button>
        <div style={{flex:1,fontSize:14,fontWeight:700,color:"#3d2c2c"}}>
          {data.momName ? `${data.momName}네 가족` : "친구 가족"} 👀
        </div>
        <div style={{fontSize:10,color:"#aaa",background:"rgba(255,255,255,0.6)",borderRadius:8,padding:"2px 7px"}}>읽기 전용</div>
      </div>

      {/* 헤더 배너 */}
      <div style={{background:"linear-gradient(135deg,#f3e8ff,#e8d5ff,#d5e8ff)",borderRadius:22,padding:"1.4rem",marginBottom:12,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-8,right:-8,opacity:.1,fontSize:70}}>🌸</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:11,color:"#7B1FA2",marginBottom:3}}>{w<=12?"1분기":w<=27?"2분기":"3분기"} · {w}주차</div>
            <div style={{fontSize:19,fontWeight:700,color:"#4A148C",lineHeight:1.3,marginBottom:7}}>
              {data.momName||"친구"}의 여정 🤰
            </div>
            {daysLeft!==null&&<div style={{display:"inline-block",background:"rgba(255,255,255,.55)",borderRadius:16,padding:"3px 11px",fontSize:11,color:"#4A148C",fontWeight:700}}>출산까지 D-{daysLeft}</div>}
            {data.dueDate&&<div style={{marginTop:5,fontSize:11,color:"rgba(74,20,140,0.7)"}}>📅 {new Date(data.dueDate).toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric"})}</div>}
            {data.babyName&&<div style={{fontSize:11,color:"#7B1FA2",marginTop:3}}>태명: {data.babyName} 💕</div>}
          </div>
          {w<=12?<BabyTiny gender={g}/>:w<=27?<BabyMid gender={g}/>:<BabyBig gender={g}/>}
        </div>
      </div>

      {/* 컨디션 카드 */}
      <div style={{background:info.bg,borderRadius:20,padding:"1.2rem",marginBottom:12,border:`2px solid ${info.color}33`}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:"#999",marginBottom:2}}>오늘 컨디션</div>
            <div style={{fontSize:16,fontWeight:700,color:info.color,marginBottom:4}}>{info.label}</div>
            {info.action&&<div style={{display:"inline-block",background:info.color,color:"#fff",borderRadius:9,padding:"3px 10px",fontSize:11,fontWeight:700}}>{info.action}</div>}
          </div>
          <div style={{flexShrink:0,marginLeft:8}}>
            {sev>=4?<SickBaby gender={g}/>:sev<=1&&(data.conditions||[]).length>0?<HappyBaby gender={g}/>:<BabyNeutral gender={g}/>}
          </div>
        </div>
        <div style={{display:"flex",gap:3,marginBottom:6}}>
          {[1,2,3,4,5].map(i=><div key={i} style={{flex:1,height:9,borderRadius:5,background:sev>=i?info.color:"#EEE"}}/>)}
        </div>
        <div style={{background:"rgba(255,255,255,.7)",borderRadius:11,padding:"8px 11px",fontSize:11,color:"#555",lineHeight:1.6,marginBottom:active.length?8:0}}>
          💬 {info.msg}
        </div>
        {active.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:4}}>
          {active.map(s=><span key={s.id} style={{background:"rgba(255,255,255,.85)",border:`1.5px solid ${s.sev>=4?"#E53935":s.sev>=3?"#FB8C00":s.sev>=2?"#FFB300":"#66BB6A"}`,borderRadius:16,padding:"3px 8px",fontSize:10,fontWeight:700,color:s.sev>=4?"#B71C1C":s.sev>=3?"#E65100":s.sev>=2?"#E65100":"#2E7D32"}}>{s.emoji} {s.label}</span>)}
        </div>}
      </div>

      {/* 메모 */}
      {data.memo&&<div className="glass-card-yellow" style={{borderRadius:16,padding:"1rem 1.2rem",marginBottom:12,border:"1px solid rgba(255,240,100,0.5)"}}>
        <div style={{fontSize:11,color:"#f9a825",fontWeight:700,marginBottom:3}}>💌 한마디</div>
        <div style={{fontSize:13,color:"#555",lineHeight:1.6}}>{data.memo}</div>
      </div>}

      {/* 다음 진료일 */}
      {nextAppt&&<div className="glass-card-blue" style={{borderRadius:16,padding:"1rem 1.2rem",marginBottom:12}}>
        <div style={{fontSize:11,color:"#1565C0",fontWeight:700,marginBottom:4}}>🗓️ 다음 진료</div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{textAlign:"center",background:"rgba(255,255,255,0.6)",borderRadius:10,padding:"6px 10px",flexShrink:0}}>
            <div style={{fontSize:9,color:"#f06292",fontWeight:700}}>{new Date(nextAppt.date).getMonth()+1}월</div>
            <div style={{fontSize:18,fontWeight:700,color:"#e91e63",lineHeight:1}}>{new Date(nextAppt.date).getDate()}</div>
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#3d2c2c"}}>{nextAppt.purpose}</div>
            {nextAppt.memo&&<div style={{fontSize:11,color:"#aaa"}}>{nextAppt.memo}</div>}
          </div>
          {(()=>{const diff=Math.round((new Date(nextAppt.date)-new Date(today))/86400000);return<div style={{marginLeft:"auto",background:diff===0?"#f06292":diff===1?"#FF7043":"rgba(240,98,146,0.12)",color:diff<=1?"#fff":"#f06292",borderRadius:9,padding:"3px 8px",fontSize:11,fontWeight:700,flexShrink:0}}>{diff===0?"오늘!":diff===1?"내일":`D-${diff}`}</div>;})()}
        </div>
      </div>}

      {/* 여정 진행 */}
      <div className="glass-card" style={{borderRadius:20,padding:"1.2rem",marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
          <span style={{fontSize:13,fontWeight:700,color:"#3d2c2c"}}>🛤️ 임신 여정</span>
          <span style={{fontSize:12,color:"#9C27B0",fontWeight:700}}>{Math.round((w/40)*100)}%</span>
        </div>
        <div style={{background:"rgba(235,220,230,.3)",borderRadius:8,height:12,overflow:"visible",position:"relative",marginBottom:8}}>
          <div style={{width:`${Math.min(100,(w/40)*100)}%`,height:"100%",background:"linear-gradient(90deg,#CE93D8,#9C27B0)",borderRadius:8,position:"relative"}}>
            <div style={{position:"absolute",right:-14,top:"50%",transform:"translateY(-50%)",fontSize:18}}>🤰</div>
          </div>
          <div style={{position:"absolute",right:-6,top:"50%",transform:"translateY(-60%)",fontSize:16}}>🍼</div>
        </div>
        <div style={{textAlign:"center",fontSize:11,color:"#bbb"}}>출산까지 <span style={{color:"#9C27B0",fontWeight:700}}>{40-w}주</span> 남았어요!</div>
      </div>

      {/* 아기 크기 */}
      <div className="glass-card" style={{borderRadius:16,padding:"1rem 1.1rem",display:"flex",gap:11,alignItems:"center"}}>
        <div style={{width:50,height:50,borderRadius:14,background:"linear-gradient(135deg,#f3e8ff,#e8d5ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{wd.emoji}</div>
        <div>
          <div style={{fontSize:11,color:"#9C27B0",fontWeight:700,marginBottom:1}}>이번 주 아기 크기</div>
          <div style={{fontSize:15,fontWeight:700,color:"#3d2c2c",marginBottom:1}}>{wd.size} 만해요</div>
          <div style={{fontSize:11,color:"#999"}}>약 {wd.sizeCm} · {wd.babyDesc}</div>
        </div>
      </div>
    </div>
  );
}

// ── 가족 탭바 (상단) ────────────────────────────────────────
function FamilyTabBar({state, activeFamily, setActiveFamily, followingData, onAdd}) {
  const families = [
    { code: null, name: state.momName || "우리 가족", emoji: "💕" },
    ...(state.followingFamilies||[]).map(fc => ({
      code: fc,
      name: followingData[fc]?.momName ? `${followingData[fc].momName}네` : fc,
      emoji: followingData[fc]?.gender==="boy" ? "👦" : followingData[fc]?.gender==="girl" ? "👧" : "🌸",
    }))
  ];

  return (
    <div style={{
      background:"rgba(255,248,252,0.95)",
      borderBottom:"1px solid rgba(240,190,215,0.4)",
      display:"flex", alignItems:"center",
      overflowX:"auto", padding:"0 4px",
    }}>
      {families.map(f=>(
        <button key={f.code||"mine"} onClick={()=>setActiveFamily(f.code)}
          style={{
            flexShrink:0, padding:"9px 14px",
            border:"none", background:"none", cursor:"pointer",
            borderBottom: activeFamily===f.code ? "2.5px solid #f06292" : "2.5px solid transparent",
            color: activeFamily===f.code ? "#e91e63" : "#bbb",
            fontSize:12, fontWeight: activeFamily===f.code ? 700 : 400,
            display:"flex", alignItems:"center", gap:4,
            transition:"all .15s",
          }}>
          <span style={{fontSize:14}}>{f.emoji}</span>
          <span>{f.name}</span>
          {/* 컨디션 도트 */}
          {f.code && followingData[f.code] && (()=>{
            const sev = calcSev(followingData[f.code].conditions||[]);
            const dotColor = sev>=4?"#E53935":sev>=3?"#FB8C00":sev>=2?"#FFB300":sev>=1?"#7CB342":"#BDBDBD";
            return <div style={{width:6,height:6,borderRadius:"50%",background:dotColor,flexShrink:0}}/>;
          })()}
        </button>
      ))}
      {/* + 추가 버튼 */}
      <button onClick={onAdd} style={{
        flexShrink:0, padding:"9px 12px",
        border:"none", background:"none", cursor:"pointer",
        color:"#f06292", fontSize:18, fontWeight:700,
      }}>＋</button>
    </div>
  );
}

// ── 가족 추가 모달 ──────────────────────────────────────────
function AddFamilyModal({onAdd, onClose, existingCodes}) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const add = async () => {
    if(code.length < 4) { setError('코드를 입력해주세요'); return; }
    const uc = code.toUpperCase().replace(/[^A-Z0-9-]/g,'');
    if(existingCodes.includes(uc)) { setError('이미 추가된 가족이에요'); return; }
    setLoading(true); setError('');
    try {
      if(window.firebaseDb && window.firebaseRef && window.firebaseOnValue) {
        const r = window.firebaseRef(window.firebaseDb, `families/${uc}/pgApp_state`);
        window.firebaseOnValue(r, (snap)=>{
          setLoading(false);
          if(snap.val()) { onAdd(uc); }
          else { setError('존재하지 않는 코드예요 😢'); }
        }, {onlyOnce:true});
      }
    } catch(e) { setLoading(false); setError('오류가 발생했어요'); }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:"0 1.5rem"}}>
      <div style={{background:"#fff",borderRadius:26,padding:"1.8rem 1.6rem",width:"100%",maxWidth:340,boxShadow:"0 20px 60px rgba(0,0,0,.18)"}}>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:36,marginBottom:6}}>👀</div>
          <div style={{fontSize:17,fontWeight:700,color:"#3d2c2c",marginBottom:3}}>가족 추가하기</div>
          <div style={{fontSize:11,color:"#aaa",lineHeight:1.6}}>친구한테 받은 가족 코드를 입력하면<br/>친구 가족 상황을 함께 볼 수 있어요!</div>
        </div>
        <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())}
          placeholder="BABY-XXXX"
          maxLength={9}
          style={{width:"100%",padding:"14px",borderRadius:14,border:"2px solid rgba(240,98,146,0.3)",fontSize:18,outline:"none",textAlign:"center",letterSpacing:4,fontWeight:700,color:"#e91e63",marginBottom:8,background:"rgba(255,248,252,0.8)"}}
        />
        {error&&<div style={{fontSize:12,color:"#E53935",marginBottom:8,textAlign:"center"}}>{error}</div>}
        <button onClick={add} disabled={loading}
          style={{width:"100%",padding:"13px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#f48fb1,#f06292)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:8,boxShadow:"0 4px 14px rgba(240,98,146,.25)"}}>
          {loading?"⏳ 확인 중...":"💕 추가하기"}
        </button>
        <button onClick={onClose}
          style={{width:"100%",padding:"11px",borderRadius:14,border:"none",background:"#f5f5f5",color:"#aaa",fontSize:13,cursor:"pointer"}}>
          취소
        </button>
        <div style={{fontSize:10,color:"#ddd",textAlign:"center",marginTop:10,lineHeight:1.6}}>
          추가된 가족은 읽기 전용이에요<br/>(수정하려면 비밀번호가 있어야 해요)
        </div>
      </div>
    </div>
  );
}

// ── 설명서 화면 ──────────────────────────────────────────
function GuideScreen() {
  const [main, setMain] = useState('visual');
  const [os, setOs] = useState('ios');

  const TabBtn = ({id, label, cur, set, style={}}) => (
    <button onClick={()=>set(id)} style={{
      flex:1, padding:"11px 6px", border:"none", background:"none", cursor:"pointer",
      fontFamily:"'Jua',sans-serif", fontSize:13,
      color: cur===id ? "#e91e63" : "#bbb",
      borderBottom: `3px solid ${cur===id ? "#e91e63" : "transparent"}`,
      marginBottom:-3, display:"flex", alignItems:"center", justifyContent:"center", gap:5,
      background: cur===id ? "#fff5f8" : "transparent",
      ...style
    }}>{label}</button>
  );

  const Sec = ({num, title, children}) => (
    <div style={{margin:"1rem 0.8rem", background:"white", borderRadius:20, boxShadow:"0 2px 14px rgba(240,98,146,.08)", border:"1px solid #fce4ec", overflow:"hidden"}}>
      <div style={{background:"linear-gradient(135deg,#fce4ec,#fde8f2)", padding:"11px 16px", display:"flex", alignItems:"center", gap:9}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:"#e91e63",color:"white",fontFamily:"'Jua',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{num}</div>
        <div style={{fontFamily:"'Jua',sans-serif",fontSize:15,color:"#880e4f"}}>{title}</div>
      </div>
      <div style={{padding:"14px 16px"}}>{children}</div>
    </div>
  );

  const Step = ({icon, title, desc}) => (
    <div style={{display:"flex",gap:12,alignItems:"flex-start",padding:"10px 0",borderBottom:"1px solid #fce4ec"}}>
      <div style={{width:36,height:36,borderRadius:10,background:"#fce4ec",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{icon}</div>
      <div><div style={{fontWeight:700,fontSize:13,marginBottom:3}}>{title}</div><div style={{fontSize:12,color:"#777",lineHeight:1.5}}>{desc}</div></div>
    </div>
  );

  const Tip  = ({c}) => <div style={{background:"#fff3e0",borderRadius:11,padding:"10px 13px",margin:"9px 0",borderLeft:"4px solid #FF9800",fontSize:12,color:"#E65100",lineHeight:1.6}}>{c}</div>;
  const Ok   = ({c}) => <div style={{background:"#E8F5E9",borderRadius:11,padding:"10px 13px",margin:"9px 0",borderLeft:"4px solid #2E7D32",fontSize:12,color:"#1B5E20",lineHeight:1.6}}>{c}</div>;
  const Info = ({c}) => <div style={{background:"#E3F2FD",borderRadius:11,padding:"10px 13px",margin:"9px 0",borderLeft:"4px solid #1565C0",fontSize:12,color:"#0D47A1",lineHeight:1.6}}>{c}</div>;

  // 폰 목업
  const Phone = ({children}) => (
    <div style={{display:"flex",justifyContent:"center",margin:"12px 0"}}>
      <div style={{width:175,background:"#1a1a2e",borderRadius:26,padding:"10px 6px",boxShadow:"0 8px 28px rgba(0,0,0,.25)",border:"4px solid #333"}}>
        <div style={{width:55,height:10,background:"#1a1a2e",borderRadius:"0 0 8px 8px",margin:"0 auto 5px"}}/>
        <div style={{background:"linear-gradient(160deg,#fff5f8,#fef6ff,#f5f8ff)",borderRadius:16,overflow:"hidden",minHeight:295,position:"relative"}}>{children}</div>
      </div>
    </div>
  );

  const PsTop = () => (
    <div style={{background:"rgba(240,249,255,.9)",padding:"4px 8px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(180,220,255,.4)"}}>
      <span style={{fontSize:6,color:"#1565C0"}}>🔄 실시간 공유 중</span>
      <span style={{fontSize:6,color:"#e91e63",background:"rgba(255,255,255,.7)",borderRadius:5,padding:"1px 4px",border:"1px solid rgba(240,98,146,.3)"}}>🔑 BABY-K7X2 📋</span>
    </div>
  );
  const PsHead = () => (
    <div style={{background:"rgba(255,248,252,.9)",padding:"5px 8px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(240,215,228,.4)"}}>
      <span style={{fontFamily:"'Jua',sans-serif",fontSize:8,color:"#880e4f"}}>🌸 Baby Journey</span>
      <span style={{background:"rgba(255,255,255,.65)",borderRadius:8,padding:"1px 4px",fontSize:6,color:"#ad1457",fontFamily:"'Jua',sans-serif"}}>16주차</span>
    </div>
  );
  const PsTabs = ({active="홈"}) => (
    <div style={{display:"flex",background:"rgba(255,250,253,.95)",borderTop:"1px solid rgba(235,210,222,.4)",padding:"3px 0 5px"}}>
      {[["🏠","홈"],["📅","주수"],["🥗","음식"],["🏥","케어"],["✏️","편집"]].map(([e,l])=>(
        <div key={l} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
          <span style={{fontSize:11}}>{e}</span>
          <span style={{fontSize:5,color:l===active?"#f06292":"#bbb",fontFamily:"'Jua',sans-serif"}}>{l}</span>
          {l===active&&<div style={{width:8,height:2,borderRadius:1,background:"#f06292"}}/>}
        </div>
      ))}
    </div>
  );

  const EntryScreen = () => (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"18px 10px",minHeight:295,background:"linear-gradient(160deg,#fff5f8,#fef6ff)"}}>
      <div style={{fontSize:30,marginBottom:5}}>🌸</div>
      <div style={{fontSize:18,marginBottom:5}}>👶</div>
      <div style={{fontFamily:"'Jua',sans-serif",fontSize:11,color:"#880e4f",marginBottom:12}}>Baby Journey</div>
      <div style={{width:"100%",padding:"7px",borderRadius:10,background:"linear-gradient(135deg,#f48fb1,#f06292)",fontFamily:"'Jua',sans-serif",fontSize:8,color:"white",textAlign:"center",marginBottom:6}}>🤰 새 가족 공간 만들기</div>
      <div style={{width:"100%",padding:"6px",borderRadius:10,border:"1.5px solid rgba(240,98,146,.35)",background:"rgba(255,255,255,.8)",fontFamily:"'Jua',sans-serif",fontSize:8,color:"#e91e63",textAlign:"center"}}>🔑 가족 코드로 참여하기</div>
    </div>
  );

  const HomeScreen = () => (
    <div>
      <PsTop/><PsHead/>
      <div style={{display:"flex",background:"rgba(255,248,252,.95)",borderBottom:"1px solid rgba(240,190,215,.4)"}}>
        {["💕 내 가족","🌸 친구네","＋"].map((t,i)=>(
          <div key={t} style={{padding:"4px 6px",fontSize:6,fontFamily:"'Jua',sans-serif",color:i===0?"#e91e63":"#bbb",borderBottom:`2px solid ${i===0?"#e91e63":"transparent"}`}}>{t}</div>
        ))}
      </div>
      <div style={{background:"linear-gradient(135deg,#fff0f5,#fde8f2)",padding:8,margin:5,borderRadius:10}}>
        <div style={{fontFamily:"'Jua',sans-serif",fontSize:9,color:"#880e4f",marginBottom:2}}>김지은의 소중한 여정 🤰</div>
        <div style={{display:"inline-block",background:"rgba(255,255,255,.6)",borderRadius:6,padding:"1px 5px",fontSize:6,color:"#880e4f",fontFamily:"'Jua',sans-serif"}}>출산까지 D-168</div>
      </div>
      <div style={{background:"#fff3f3",margin:"0 5px 4px",padding:"5px 6px",borderRadius:8,border:"1px solid rgba(229,57,53,.2)"}}>
        <div style={{fontSize:6,color:"#999",marginBottom:1}}>오늘 엄마 컨디션</div>
        <div style={{fontFamily:"'Jua',sans-serif",fontSize:9,color:"#E53935"}}>😢 많이 힘듦</div>
        <div style={{display:"flex",gap:2,marginTop:2}}>
          {[1,2,3,4].map(i=><div key={i} style={{flex:1,height:4,borderRadius:2,background:"#E53935"}}/>)}
          <div style={{flex:1,height:4,borderRadius:2,background:"#eee"}}/>
        </div>
        <div style={{fontSize:6,color:"#555",marginTop:2}}>💬 많이 힘든 날이에요. 전화해주세요 📞</div>
      </div>
      <PsTabs active="홈"/>
    </div>
  );

  const PwScreen = ({code="BABY-K7X2"}) => (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"14px 10px",background:"linear-gradient(160deg,#fff5f8,#fef6ff)",minHeight:295}}>
      <div style={{fontSize:24,marginBottom:5}}>🔐</div>
      <div style={{fontFamily:"'Jua',sans-serif",fontSize:11,marginBottom:2}}>비밀번호 설정</div>
      <div style={{fontSize:7,color:"#aaa",textAlign:"center",marginBottom:10,lineHeight:1.5}}>숫자 4자리 · 두 번 입력해요</div>
      <div style={{background:"rgba(255,240,248,.7)",borderRadius:8,padding:"5px 10px",textAlign:"center",width:"100%",marginBottom:9,border:"1px solid rgba(240,98,146,.2)"}}>
        <div style={{fontSize:6,color:"#aaa"}}>내 가족 코드</div>
        <div style={{fontFamily:"'Jua',sans-serif",fontSize:13,color:"#e91e63",letterSpacing:2}}>{code}</div>
      </div>
      {["비밀번호","비밀번호 확인"].map((l,li)=>(
        <div key={l} style={{width:"100%",marginBottom:6}}>
          <div style={{fontSize:7,color:"#888",marginBottom:2}}>{l}</div>
          <div style={{display:"flex",gap:3}}>
            {[0,1,2,3].map(i=><div key={i} style={{flex:1,height:9,borderRadius:5,background:li===0||i<2?"#f06292":"white",border:"1.5px solid rgba(240,98,146,.4)"}}/>)}
          </div>
        </div>
      ))}
      <div style={{marginTop:8,width:"100%",background:"linear-gradient(135deg,#f48fb1,#f06292)",borderRadius:9,padding:"7px",textAlign:"center",fontFamily:"'Jua',sans-serif",fontSize:9,color:"white"}}>✅ 완료! 가족 공간 만들기</div>
    </div>
  );

  const EditScreen = () => (
    <div>
      <PsTop/>
      <div style={{background:"rgba(255,235,245,.9)",padding:"6px 8px",fontFamily:"'Jua',sans-serif",fontSize:8,color:"#880e4f",borderBottom:"1px solid rgba(255,200,225,.3)"}}>✏️ 엄마 전용 편집</div>
      <div style={{background:"white",margin:5,borderRadius:10,padding:6,border:"1px solid #fce4ec"}}>
        <div style={{fontSize:7,fontWeight:700,color:"#f06292",marginBottom:5}}>📋 기본 정보</div>
        {[["엄마 이름","김지은"],["아기 태명","콩이"]].map(([l,v])=>(
          <div key={l} style={{marginBottom:4}}>
            <div style={{fontSize:6,color:"#999",marginBottom:1}}>{l}</div>
            <div style={{background:"white",border:"1.5px solid #f8bbd0",borderRadius:5,padding:"3px 6px",fontSize:7}}>{v}</div>
          </div>
        ))}
        <div style={{fontSize:6,color:"#f06292",fontWeight:700,marginBottom:1}}>출산 예정일 ← 여기!</div>
        <div style={{background:"white",border:"1.5px solid #f06292",borderRadius:5,padding:"3px 6px",fontSize:7,marginBottom:2}}>2025년 10월 15일</div>
        <div style={{fontSize:6,color:"#f06292"}}>📅 주수 자동계산: <b>16주차</b></div>
      </div>
      <div style={{margin:5,padding:6,background:"linear-gradient(135deg,#f48fb1,#f06292)",borderRadius:8,textAlign:"center",fontFamily:"'Jua',sans-serif",fontSize:8,color:"white"}}>💾 저장하기</div>
      <PsTabs active="편집"/>
    </div>
  );

  const JoinScreen = () => (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"16px 10px",minHeight:295,background:"linear-gradient(160deg,#fff5f8,#fef6ff)"}}>
      <div style={{fontSize:18,marginBottom:5}}>👶</div>
      <div style={{fontFamily:"'Jua',sans-serif",fontSize:11,color:"#880e4f",marginBottom:10}}>Baby Journey</div>
      <div style={{width:"100%",padding:"6px",borderRadius:10,border:"1.5px solid #e91e63",background:"rgba(255,200,220,.2)",fontFamily:"'Jua',sans-serif",fontSize:8,color:"#e91e63",textAlign:"center",marginBottom:10,position:"relative"}}>
        🔑 가족 코드로 참여하기
        <div style={{position:"absolute",top:-17,left:"50%",transform:"translateX(-50%)",background:"#e91e63",color:"white",borderRadius:5,padding:"1px 5px",fontSize:6,whiteSpace:"nowrap",fontFamily:"'Jua',sans-serif"}}>← 이걸!</div>
      </div>
      <div style={{background:"rgba(255,255,255,.82)",borderRadius:11,padding:"9px 8px",width:"100%",border:"1px solid rgba(255,200,225,.5)"}}>
        <div style={{fontFamily:"'Jua',sans-serif",fontSize:8,color:"#3d2c2c",marginBottom:3,textAlign:"center"}}>🔑 가족 코드 입력</div>
        <div style={{width:"100%",padding:"6px",borderRadius:7,border:"2px solid rgba(240,98,146,.3)",fontSize:10,textAlign:"center",letterSpacing:2,color:"#e91e63",fontFamily:"'Jua',sans-serif",background:"rgba(255,248,252,.8)",marginBottom:5}}>BABY-K7X2</div>
        <div style={{background:"linear-gradient(135deg,#f48fb1,#f06292)",borderRadius:7,padding:5,textAlign:"center",fontFamily:"'Jua',sans-serif",fontSize:8,color:"white"}}>💕 참여하기</div>
      </div>
    </div>
  );

  const HospScreen = () => (
    <div>
      <PsTop/><PsHead/>
      <div style={{padding:5}}>
        <div style={{background:"white",borderRadius:10,padding:7,border:"1px solid #BBDEFB"}}>
          <div style={{fontSize:7,fontWeight:700,color:"#1565C0",marginBottom:5}}>🏥 다니는 병원 등록</div>
          {[["🏥 병원명","더블유여성병원"],["📍 지역 (시·구까지)","광주 광산구"]].map(([l,v])=>(
            <div key={l} style={{marginBottom:4}}>
              <div style={{fontSize:6,color:"#888",marginBottom:1}}>{l}</div>
              <div style={{background:"#F8FBFF",border:"1.5px solid #BBDEFB",borderRadius:5,padding:"3px 6px",fontSize:7}}>{v}</div>
            </div>
          ))}
          <div style={{background:"rgba(240,249,255,.8)",borderRadius:5,padding:"3px 6px",marginBottom:4,fontSize:6,color:"#1565C0"}}>🔍 <b>"더블유여성병원 광주 광산구"</b></div>
          <div style={{display:"flex",gap:3}}>
            <div style={{flex:1,background:"#03C75A",borderRadius:6,padding:4,textAlign:"center",fontSize:6,color:"white",fontFamily:"'Jua',sans-serif"}}>🗺️ 지도 확인</div>
            <div style={{flex:1,background:"#E3F2FD",border:"1px solid #1565C0",borderRadius:6,padding:4,textAlign:"center",fontSize:6,color:"#1565C0",fontFamily:"'Jua',sans-serif"}}>✅ 등록</div>
          </div>
        </div>
      </div>
    </div>
  );

  // 콘텐츠 렌더
  const renderVisualIOS = () => (
    <div style={{paddingBottom:"3rem"}}>
      <Sec num="1" title="카톡 링크 열기">
        <p style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:10}}>카톡에서 받은 링크를 <b>길게 눌러 "Safari로 열기"</b>를 선택하세요.</p>
        <Phone><EntryScreen/></Phone>
        <Tip c={<>⚠️ <b>Safari</b>로 열어야 저장이 잘 돼요!</>}/>
      </Sec>
      <Sec num="2" title="홈 화면에 저장 (꼭!)">
        <p style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:10}}>Safari 하단 <b>공유 버튼(□↑)</b> → <b>"홈 화면에 추가"</b> 선택</p>
        <Phone>
          <div style={{display:"flex",flexDirection:"column",minHeight:295}}>
            <div style={{flex:1,background:"linear-gradient(160deg,#fff5f8,#fef6ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30}}>🌸</div>
            <div style={{background:"rgba(248,248,248,.95)",padding:"6px 8px",display:"flex",justifyContent:"space-around",alignItems:"center",borderTop:"1px solid #ddd"}}>
              <span style={{fontSize:13,color:"#007AFF"}}>◀</span><span style={{fontSize:13,color:"#007AFF"}}>▶</span>
              <div style={{background:"#007AFF",borderRadius:5,padding:"2px 5px",position:"relative"}}>
                <span style={{fontSize:11,color:"white"}}>□↑</span>
                <div style={{position:"absolute",top:-20,left:"50%",transform:"translateX(-50%)",background:"#e91e63",color:"white",borderRadius:5,padding:"1px 5px",fontSize:7,whiteSpace:"nowrap",fontFamily:"'Jua',sans-serif"}}>← 이걸!</div>
              </div>
              <span style={{fontSize:13,color:"#007AFF"}}>📖</span><span style={{fontSize:13,color:"#007AFF"}}>⋯</span>
            </div>
          </div>
        </Phone>
        <Tip c={<>⚠️ <b>홈 화면 저장 필수!</b> 뒤로가기 눌러도 초기화 안 돼요!</>}/>
      </Sec>
      <Sec num="3" title="엄마 — 새 가족 공간 만들기">
        <div style={{display:"inline-block",background:"#fce4ec",color:"#e91e63",borderRadius:20,padding:"2px 11px",fontSize:11,fontWeight:700,marginBottom:9}}>👩 엄마(임산부)만 하세요</div>
        <p style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:10}}>"새 가족 공간 만들기" 버튼 → 비밀번호 설정 → 코드 자동 생성!</p>
        <Phone><PwScreen/></Phone>
        <Ok c="✅ 비밀번호는 생일 같은 기억하기 쉬운 숫자로! 카톡 나에게 보내기로 저장해두세요!"/>
      </Sec>
      <Sec num="4" title="엄마 — 기본 정보 입력">
        <div style={{display:"inline-block",background:"#fce4ec",color:"#e91e63",borderRadius:20,padding:"2px 11px",fontSize:11,fontWeight:700,marginBottom:9}}>👩 엄마만</div>
        <p style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:10}}>✏️ 편집 탭 → 비밀번호 입력 → 출산예정일 입력하면 주수 자동계산!</p>
        <Phone><EditScreen/></Phone>
        <Ok c="✅ 출산예정일 입력 → 주수 자동계산! 저장 → 5초 이내 가족 폰에 반영!"/>
      </Sec>
      <Sec num="5" title="가족 — 코드로 참여하기">
        <div style={{display:"inline-block",background:"#E3F2FD",color:"#1565C0",borderRadius:20,padding:"2px 11px",fontSize:11,fontWeight:700,marginBottom:9}}>👨‍👩‍👧 가족 (남편·부모님 등)</div>
        <p style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:10}}>링크 클릭하면 자동 입장! 코드만 받았으면 직접 입력.</p>
        <Phone><JoinScreen/></Phone>
        <Ok c="✅ 한 번 입력하면 다음부터 자동으로 바로 입장!"/>
        <Tip c={<>⚠️ 아이폰은 반드시 <b>홈 화면에 저장</b>해두세요!</>}/>
      </Sec>
      <Sec num="6" title="홈 화면 보기">
        <p style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:10}}>엄마 컨디션·여정·병원 정보 한눈에! 상단 탭으로 친구 가족 전환!</p>
        <Phone><HomeScreen/></Phone>
        <Info c="💡 상단 탭에서 친구 가족도 클릭 한 번으로 전환!"/>
      </Sec>
      <Sec num="7" title="병원 등록하기">
        <div style={{display:"inline-block",background:"#fce4ec",color:"#e91e63",borderRadius:20,padding:"2px 11px",fontSize:11,fontWeight:700,marginBottom:9}}>👩 엄마만</div>
        <p style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:10}}>🏥 케어 탭 → 병원명 + 지역 입력 → 네이버 지도에서 정확히 한 곳!</p>
        <Phone><HospScreen/></Phone>
        <Ok c="✅ 지역까지 입력하면 동일 이름 병원 여러 개 뜨는 문제 해결!"/>
      </Sec>
    </div>
  );

  const renderVisualAndroid = () => (
    <div style={{paddingBottom:"3rem"}}>
      <Sec num="1" title="카톡 링크 열기">
        <p style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:10}}>카톡 링크 클릭 또는 길게 눌러 <b>"Chrome으로 열기"</b> 선택.</p>
        <Phone><EntryScreen/></Phone>
        <Ok c="✅ 안드로이드는 아이폰보다 훨씬 안정적이에요!"/>
      </Sec>
      <Sec num="2" title="홈 화면에 저장 (추천)">
        <p style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:10}}>Chrome <b>⋮ 메뉴</b> → <b>"홈 화면에 추가"</b> 선택</p>
        <Phone>
          <div style={{display:"flex",flexDirection:"column",minHeight:295}}>
            <div style={{background:"#f5f5f5",padding:"6px 8px",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:7,color:"#333"}}>
              <span>baby-journey-mocha...</span>
              <div style={{background:"#e91e63",borderRadius:4,padding:"2px 5px",color:"white",fontFamily:"'Jua',sans-serif",fontSize:7,position:"relative"}}>
                ⋮
                <div style={{position:"absolute",top:-17,right:0,background:"#e91e63",color:"white",borderRadius:5,padding:"1px 5px",fontSize:6,whiteSpace:"nowrap",fontFamily:"'Jua',sans-serif"}}>← 메뉴!</div>
              </div>
            </div>
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(160deg,#fff5f8,#fef6ff)"}}>
              <div style={{background:"white",borderRadius:10,padding:"8px 11px",boxShadow:"0 2px 10px rgba(0,0,0,.1)",width:"80%"}}>
                {["새 탭","북마크"].map(t=><div key={t} style={{fontSize:7,padding:"4px 0",borderBottom:"1px solid #f5f5f5",color:"#333"}}>{t}</div>)}
                <div style={{fontSize:7,padding:"4px 0",borderBottom:"1px solid #f5f5f5",fontWeight:700,color:"#e91e63"}}>홈 화면에 추가 ← 이거!</div>
                <div style={{fontSize:7,padding:"4px 0",color:"#333"}}>공유</div>
              </div>
            </div>
          </div>
        </Phone>
        <Info c="💡 앱처럼 홈 화면에서 편하게 접속!"/>
      </Sec>
      <Sec num="3" title="엄마 — 새 가족 공간 만들기">
        <div style={{display:"inline-block",background:"#fce4ec",color:"#e91e63",borderRadius:20,padding:"2px 11px",fontSize:11,fontWeight:700,marginBottom:9}}>👩 엄마(임산부)만 하세요</div>
        <p style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:10}}>"새 가족 공간 만들기" → 비밀번호 설정 → 코드 생성!</p>
        <Phone><PwScreen code="BABY-M3P9"/></Phone>
        <Ok c="✅ 코드는 상단에 항상 표시! 📋 누르면 복사! 카톡에 저장해두세요!"/>
      </Sec>
      <Sec num="4" title="엄마 — 기본 정보 입력">
        <div style={{display:"inline-block",background:"#fce4ec",color:"#e91e63",borderRadius:20,padding:"2px 11px",fontSize:11,fontWeight:700,marginBottom:9}}>👩 엄마만</div>
        <p style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:10}}>✏️ 편집 탭 → 비밀번호 → 출산예정일 입력 → 주수 자동계산!</p>
        <Phone><EditScreen/></Phone>
        <Ok c="✅ 저장 누르면 가족들 폰에 5초 이내로 반영!"/>
      </Sec>
      <Sec num="5" title="가족 — 코드로 참여하기">
        <div style={{display:"inline-block",background:"#E3F2FD",color:"#1565C0",borderRadius:20,padding:"2px 11px",fontSize:11,fontWeight:700,marginBottom:9}}>👨‍👩‍👧 가족</div>
        <p style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:10}}>링크 클릭하면 자동 입장! 코드만 받으면 직접 입력.</p>
        <Phone><JoinScreen/></Phone>
        <Ok c="✅ 한 번 입력 → 다음부터 자동 입장!"/>
      </Sec>
      <Sec num="6" title="홈 화면 보기">
        <p style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:10}}>엄마 컨디션·여정·병원 정보 한눈에!</p>
        <Phone><HomeScreen/></Phone>
        <Info c="💡 ＋ 버튼으로 친구 가족 추가 후 탭 전환!"/>
      </Sec>
    </div>
  );

  const renderTextGuide = (isAndroid) => (
    <div style={{paddingBottom:"3rem"}}>
      <Sec num="1" title="앱 처음 열기">
        <Step icon="📱" title={isAndroid?"Chrome에서 링크 열기":"Safari에서 링크 열기"} desc={isAndroid?"카톡 링크 클릭 또는 길게 눌러 'Chrome으로 열기' 선택.":"카톡 링크를 길게 눌러 'Safari로 열기' 선택."}/>
        <Step icon="🔖" title="홈 화면에 저장" desc={isAndroid?"Chrome ⋮ 메뉴 → '홈 화면에 추가'":"Safari 하단 공유 버튼(□↑) → '홈 화면에 추가'"}/>
        {!isAndroid && <Tip c={<>⚠️ <b>홈 화면 저장 필수!</b> 뒤로가기 누르면 코드가 초기화될 수 있어요!</>}/>}
        {isAndroid && <Ok c="✅ 안드로이드는 아이폰보다 훨씬 안정적이에요!"/>}
      </Sec>
      <Sec num="2" title="엄마 — 가족 공간 만들기">
        <div style={{display:"inline-block",background:"#fce4ec",color:"#e91e63",borderRadius:20,padding:"2px 11px",fontSize:11,fontWeight:700,marginBottom:9}}>👩 엄마(임산부)만</div>
        <Step icon="👶" title='"새 가족 공간 만들기" 클릭' desc="꽃잎 날리는 첫 화면에서 분홍 버튼!"/>
        <Step icon="🔐" title="비밀번호 4자리 설정" desc="숫자 4자리 두 번 입력. 생일 같은 기억하기 쉬운 번호로!"/>
        <Step icon="💬" title="카톡으로 코드 저장" desc="생성 후 노란 카톡 버튼 눌러서 '나에게 보내기'로 저장!"/>
      </Sec>
      <Sec num="3" title="엄마 — 기본 정보 입력">
        <div style={{display:"inline-block",background:"#fce4ec",color:"#e91e63",borderRadius:20,padding:"2px 11px",fontSize:11,fontWeight:700,marginBottom:9}}>👩 엄마만</div>
        <Step icon="✏️" title="편집 탭 → 비밀번호 입력" desc="아래 탭바 ✏️ 편집 클릭 → 비밀번호 4자리"/>
        <Step icon="📝" title="기본 정보 입력" desc="이름 / 태명 / 출산 예정일(→ 주수 자동계산!) / 성별"/>
        <Step icon="🩺" title="오늘 증상 선택" desc="입덧·통증·기분 등 선택 → 가족에게 컨디션 전달"/>
        <Step icon="💾" title="저장하기 클릭" desc="분홍 저장 버튼 → 5초 이내 가족 폰에 즉시 반영!"/>
        <Ok c="✅ 출산예정일 입력 → 주수 자동계산! 저장 → 즉시 반영!"/>
      </Sec>
      <Sec num="4" title="가족 — 코드로 참여하기">
        <div style={{display:"inline-block",background:"#E3F2FD",color:"#1565C0",borderRadius:20,padding:"2px 11px",fontSize:11,fontWeight:700,marginBottom:9}}>👨‍👩‍👧 가족 (남편·부모님·형제)</div>
        <Step icon="🔗" title="카톡 링크 클릭" desc="코드 포함된 링크면 클릭만으로 자동 입장!"/>
        <Step icon="🔑" title="코드 직접 입력" desc="'🔑 가족 코드로 참여하기' → BABY-XXXX 입력 → 참여하기"/>
        <Ok c="✅ 한 번 입력하면 다음부터 자동 입장!"/>
        {!isAndroid && <Tip c={<>⚠️ 아이폰은 <b>홈 화면에 저장</b>해두세요!</>}/>}
      </Sec>
      <Sec num="5" title="앱 화면 구성">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[["🏠","홈","컨디션·여정·아기크기·병원"],["📅","주수","주차별 태아·산모 변화"],["🥗","음식","먹어도 되는/주의 음식"],["🏥","케어","병원·진료일정·체크리스트"],["📸","사진","초음파 사진 앨범"],["✏️","편집","엄마 전용 (비밀번호 필요)"]].map(([e,n,d])=>(
            <div key={n} style={{background:"#fce4ec",borderRadius:13,padding:"10px",textAlign:"center"}}>
              <div style={{fontSize:20,marginBottom:3}}>{e}</div>
              <div style={{fontFamily:"'Jua',sans-serif",fontSize:12,color:"#880e4f",marginBottom:2}}>{n}</div>
              <div style={{fontSize:10,color:"#777",lineHeight:1.3}}>{d}</div>
            </div>
          ))}
        </div>
      </Sec>
      <Sec num="❓" title="자주 묻는 질문">
        {!isAndroid && <Step icon="😰" title="뒤로가기 눌렀더니 처음 화면이에요" desc="홈 화면 저장해두면 해결! 코드 다시 입력해서 재입장 가능."/>}
        <Step icon="🔐" title="비밀번호 잊어버렸어요" desc="편집 탭 → 맨 아래 비밀번호 변경 항목에서 변경"/>
        <Step icon="🔑" title="가족 코드 잊어버렸어요" desc="앱 상단에 항상 표시! 🔑 BABY-XXXX 📋 누르면 복사. 또는 카톡 나에게 보내기 확인!"/>
        <Step icon="🔄" title="저장했는데 안 보여요" desc="최대 5초 대기. 그래도 안 되면 새로고침!"/>
        <Step icon="📸" title="사진 어디서 올려요?" desc="📸 사진 탭. 엄마만 업로드 가능."/>
      </Sec>
    </div>
  );

  return (
    <div style={{fontFamily:"'Noto Sans KR',sans-serif",maxWidth:540,margin:"0 auto",background:"#fff9fb",minHeight:"100vh"}}>
      {/* 헤더 */}
      <div style={{background:"linear-gradient(135deg,#fce4ec,#f8bbd0,#f48fb1)",padding:"1.8rem 1.2rem 1.5rem",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",fontSize:110,opacity:.06,top:-15,right:-10}}>🌸</div>
        <h1 style={{fontFamily:"'Jua',sans-serif",fontSize:"1.7rem",color:"#880e4f",marginBottom:4}}>🌸 Baby Journey 사용 설명서</h1>
        <p style={{fontSize:12,color:"#ad1457",marginBottom:12}}>임산부와 가족을 위한 임신 여정 공유 앱</p>
        <a href={window.location.origin} style={{display:"inline-block",background:"rgba(255,255,255,.75)",borderRadius:20,padding:"6px 16px",fontSize:12,color:"#880e4f",fontWeight:700,border:"1px solid rgba(240,98,146,.3)",textDecoration:"none"}}>← 앱으로 돌아가기</a>
      </div>

      {/* 메인 탭 */}
      <div style={{display:"flex",background:"white",borderBottom:"3px solid #f8bbd0",position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 10px rgba(240,98,146,.1)"}}>
        <TabBtn id="visual" label="🖼️ 그림 설명서" cur={main} set={setMain}/>
        <TabBtn id="text"   label="📄 텍스트 설명서" cur={main} set={setMain}/>
      </div>

      {/* OS 탭 */}
      <div style={{display:"flex",background:"#fff5f8",borderBottom:"2px solid #fce4ec",position:"sticky",top:49,zIndex:199}}>
        <TabBtn id="ios"     label="🍎 iPhone (iOS)" cur={os} set={setOs} style={{fontSize:12}}/>
        <TabBtn id="android" label="🤖 안드로이드"   cur={os} set={setOs} style={{fontSize:12}}/>
      </div>

      {/* 콘텐츠 */}
      {main==="visual" && os==="ios"     && renderVisualIOS()}
      {main==="visual" && os==="android" && renderVisualAndroid()}
      {main==="text"   && os==="ios"     && renderTextGuide(false)}
      {main==="text"   && os==="android" && renderTextGuide(true)}

      <div style={{textAlign:"center",padding:"2rem",fontSize:11,color:"#ccc",background:"white"}}>
        🌸 Baby Journey · {window.location.origin}
      </div>
    </div>
  );
}

// ── 가족 코드 진입 화면 (예쁜 버전) ────────────────────────
function FamilyEntry({onEnter}) {
  const [mode, setMode] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let r = 'BABY-';
    for(let i=0;i<4;i++) r += chars[Math.floor(Math.random()*chars.length)];
    return r;
  };

  const [setupStep, setSetupStep] = useState(null); // null | 'password' | 'done'
  const [newCode, setNewCode] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [pwError, setPwError] = useState('');

  const startCreate = () => {
    const code = generateCode();
    setNewCode(code);
    setSetupStep('password');
  };

  const createFamily = async () => {
    if(password.length !== 4 || !/^\d{4}$/.test(password)) {
      setPwError('숫자 4자리로 설정해주세요'); return;
    }
    if(password !== password2) {
      setPwError('비밀번호가 일치하지 않아요'); return;
    }
    setLoading(true);
    try {
      if(window.firebaseDb && window.firebaseRef) {
        const { set: fbSet } = await import('firebase/database');
        const r = window.firebaseRef(window.firebaseDb, `families/${newCode}/pgApp_state`);
        await fbSet(r, JSON.stringify({
          week:8, gender:"unknown", dueDate:"", babyName:"", momName:"",
          conditions:[], pin:password, memo:"", foodRatings:{},
          hospital:null, checkToday:{}, checkDate:"", appointments:[], familyCode:newCode
        }));
      }
    } catch(e) {}
    setLoading(false);
    setSetupStep('done'); // 완료 화면으로
  };

  // joinFamily onEnter 후 처리는 onEnter 콜백에서 함

  const joinFamily = async () => {
    if(code.length < 4) { setError('코드를 정확히 입력해주세요'); return; }
    setLoading(true); setError('');
    const uc = code.toUpperCase().replace(/[^A-Z0-9-]/g,'');
    try {
      if(window.firebaseDb && window.firebaseRef && window.firebaseOnValue) {
        const r = window.firebaseRef(window.firebaseDb, `families/${uc}/pgApp_state`);
        window.firebaseOnValue(r, (snap) => {
          setLoading(false);
          if(snap.val()) onEnter(uc);
          else setError('존재하지 않는 코드예요 😢 다시 확인해주세요!');
        }, { onlyOnce:true });
      } else { setTimeout(joinFamily, 500); }
    } catch(e) { setLoading(false); setError('연결 오류예요. 다시 시도해주세요.'); }
  };

  // 벚꽃 파티클 데이터
  const petals = Array.from({length:18}, (_,i) => ({
    id:i,
    left: Math.random()*100,
    delay: Math.random()*6,
    duration: 4 + Math.random()*4,
    size: 8 + Math.random()*12,
    emoji: ['🌸','🌺','🌷','🍀','🌻','🍁','❄️','⭐','🌼','💐'][Math.floor(Math.random()*10)],
  }));

  return (
    <div style={{
      fontFamily:"'Jua','Noto Sans KR',sans-serif",
      maxWidth:430, margin:"0 auto", minHeight:"100vh",
      position:"relative", overflow:"hidden",
      background:"linear-gradient(160deg, #fff0f5 0%, #fde8f5 20%, #f5e8ff 45%, #e8f0ff 70%, #e8fff5 100%)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jua&family=Noto+Sans+KR:wght@400;700&display=swap');
        * { font-family:'Jua','Noto Sans KR',sans-serif; box-sizing:border-box; }
        @keyframes fall {
          0%   { transform: translateY(-30px) rotate(0deg) scale(1); opacity:0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.7; }
          100% { transform: translateY(110vh) rotate(360deg) scale(0.6); opacity:0; }
        }
        @keyframes sway {
          0%,100% { margin-left:0px; }
          50%      { margin-left:30px; }
        }
        @keyframes heartbeat {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.08); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0%   { opacity:0.4; }
          50%  { opacity:1; }
          100% { opacity:0.4; }
        }
        .petal {
          position:fixed; top:-40px; pointer-events:none !important; z-index:0;
          animation: fall linear infinite, sway ease-in-out infinite;
        }
        .heartbeat { animation: heartbeat 1.8s ease-in-out infinite; }
        .float-anim { animation: float 3s ease-in-out infinite; }
        .shimmer { animation: shimmer 2.5s ease-in-out infinite; }
      `}</style>

      {/* 벚꽃 파티클 */}
      {petals.map(p=>(
        <div key={p.id} className="petal" style={{
          left:`${p.left}%`,
          fontSize:`${p.size}px`,
          animationDuration:`${p.duration}s, ${p.duration*1.3}s`,
          animationDelay:`${p.delay}s`,
        }}>{p.emoji}</div>
      ))}

      {/* 배경 빛 번짐 */}
      <div style={{position:"fixed",top:"-60px",left:"-40px",width:280,height:280,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,182,215,0.22) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:"-60px",right:"-40px",width:260,height:260,borderRadius:"50%",background:"radial-gradient(circle,rgba(182,210,255,0.18) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",top:"40%",left:"-30px",width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(200,240,220,0.15) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>

      {/* 메인 콘텐츠 */}
      <div style={{position:"relative",zIndex:10,width:"100%",padding:"0 1.8rem",display:"flex",flexDirection:"column",alignItems:"center"}}>

        {/* 아기 일러스트 영역 */}
        <div className="float-anim" style={{marginBottom:20,position:"relative"}}>
          {/* 빛나는 후광 */}
          <div className="shimmer" style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:160,height:160,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,182,215,0.35) 0%,rgba(255,210,235,0.15) 50%,transparent 70%)"}}/>
          {/* 자궁 원 */}
          <svg viewBox="0 0 200 200" width={180} height={180}>
            {/* 외부 빛 링 */}
            <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,182,215,0.3)" strokeWidth="2" strokeDasharray="8 6"/>
            {/* 자궁 배경 */}
            <circle cx="100" cy="100" r="80" fill="rgba(255,240,248,0.7)" stroke="rgba(255,182,215,0.5)" strokeWidth="1.5"/>
            <circle cx="100" cy="100" r="72" fill="rgba(255,228,240,0.6)"/>
            {/* 반짝이 별들 */}
            <text x="28" y="45" fontSize="11" opacity="0.6">✨</text>
            <text x="155" y="55" fontSize="9" opacity="0.5">⭐</text>
            <text x="35" y="158" fontSize="9" opacity="0.5">💫</text>
            <text x="152" y="165" fontSize="11" opacity="0.6">✨</text>
            {/* 아기 몸통 */}
            <ellipse cx="102" cy="118" rx="28" ry="22" fill="#FFDDD2"/>
            {/* 아기 다리 (웅크림) */}
            <ellipse cx="80" cy="130" rx="14" ry="10" fill="#FFDDD2" transform="rotate(-35 80 130)"/>
            <ellipse cx="122" cy="130" rx="14" ry="10" fill="#FFDDD2" transform="rotate(35 122 130)"/>
            {/* 기저귀 */}
            <ellipse cx="102" cy="120" rx="22" ry="12" fill="#FFF9C4"/>
            <rect x="80" y="110" width="10" height="7" rx="2" fill="#FFF176"/>
            <rect x="114" y="110" width="10" height="7" rx="2" fill="#FFF176"/>
            {/* 작은 손 */}
            <circle cx="84" cy="112" r="7" fill="#FFDDD2"/>
            {/* 아기 머리 (크게) */}
            <circle cx="102" cy="82" r="32" fill="#FFDDD2"/>
            {/* 귀 */}
            <ellipse cx="70" cy="82" rx="6" ry="7" fill="#FFDDD2"/>
            <ellipse cx="134" cy="82" rx="6" ry="7" fill="#FFDDD2"/>
            {/* 볼터치 */}
            <ellipse cx="88" cy="87" rx="7" ry="4.5" fill="#F2B8A0" opacity="0.65"/>
            <ellipse cx="116" cy="87" rx="7" ry="4.5" fill="#F2B8A0" opacity="0.65"/>
            {/* 눈 (감은) */}
            <path d="M90 78 Q94 74 98 78" stroke="#5C3D2E" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
            <path d="M106 78 Q110 74 114 78" stroke="#5C3D2E" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
            {/* 코 */}
            <ellipse cx="102" cy="83" rx="2.5" ry="1.5" fill="#E8A882" opacity="0.5"/>
            {/* 입 (살짝 웃음) */}
            <path d="M96 90 Q102 95 108 90" stroke="#D4896A" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
            {/* 탯줄 */}
            <path d="M102 140 Q112 152 100 162" stroke="#F2B8A0" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4"/>
            {/* 하트 */}
            <text x="88" y="62" fontSize="10" opacity="0.7">💕</text>
          </svg>
        </div>

        {/* 타이틀 */}
        <div className="heartbeat" style={{textAlign:"center",marginBottom:6}}>
          <div style={{fontSize:30,fontWeight:700,color:"#880e4f",letterSpacing:1,textShadow:"0 2px 8px rgba(240,98,146,0.2)"}}>
            🌸 Baby Journey
          </div>
        </div>
        <div style={{fontSize:13,color:"#c2185b",marginBottom:6,textAlign:"center",opacity:0.8}}>
          피어나는 생명, 소중한 여정
        </div>
        <div style={{fontSize:11,color:"#aaa",marginBottom:28,textAlign:"center",lineHeight:1.7}}>
          임산부와 가족을 위한<br/>임신 여정 실시간 공유 앱 💕
        </div>

        {/* 버튼 영역 */}
        {!mode && (
          <div style={{width:"100%",maxWidth:340}}>
            <button onClick={startCreate}
              style={{width:"100%",padding:"17px",borderRadius:22,border:"none",
                background:"linear-gradient(135deg,#f48fb1 0%,#f06292 50%,#e91e63 100%)",
                color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",
                marginBottom:12,boxShadow:"0 6px 20px rgba(240,98,146,.35)",
                display:"flex",alignItems:"center",justifyContent:"center",gap:10,
              }}>
              <span style={{fontSize:22}}>🤰</span> 새 가족 공간 만들기
            </button>

            <button onClick={()=>setMode('join')}
              style={{width:"100%",padding:"17px",borderRadius:22,
                border:"2px solid rgba(240,98,146,0.35)",
                background:"rgba(255,255,255,0.75)",
                backdropFilter:"blur(10px)",
                color:"#e91e63",fontSize:16,fontWeight:700,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",gap:10,
                boxShadow:"0 4px 14px rgba(240,98,146,.1)",
              }}>
              <span style={{fontSize:22}}>🔑</span> 가족 코드로 참여하기
            </button>

            <div style={{display:"flex",alignItems:"center",gap:8,margin:"20px 0 0"}}>
              <div style={{flex:1,height:1,background:"rgba(240,98,146,0.15)"}}/>
              <div style={{fontSize:11,color:"#ddd",whiteSpace:"nowrap"}}>처음이세요?</div>
              <div style={{flex:1,height:1,background:"rgba(240,98,146,0.15)"}}/>
            </div>
            <div style={{textAlign:"center",fontSize:11,color:"#ccc",marginTop:8,lineHeight:1.8}}>
              임산부(엄마)가 먼저 <b style={{color:"#f06292"}}>새 가족 공간 만들기</b>로<br/>
              공간을 만든 후 가족들에게 코드를 공유해주세요
            </div>
          </div>
        )}

        {/* 비밀번호 설정 화면 */}
        {setupStep==='password' && (
          <div style={{width:"100%",maxWidth:340}}>
            <div style={{background:"rgba(255,255,255,0.82)",backdropFilter:"blur(16px)",borderRadius:24,padding:"1.6rem",border:"1px solid rgba(255,200,225,0.5)",boxShadow:"0 4px 20px rgba(240,98,146,.1)"}}>
              <div style={{textAlign:"center",marginBottom:16}}>
                <div style={{fontSize:32,marginBottom:6}}>🔐</div>
                <div style={{fontSize:16,fontWeight:700,color:"#3d2c2c",marginBottom:3}}>비밀번호 설정</div>
                <div style={{fontSize:11,color:"#aaa",lineHeight:1.6}}>편집할 때 사용할 비밀번호를<br/>숫자 4자리로 설정해주세요</div>
              </div>
              <div style={{background:"rgba(255,240,248,0.7)",borderRadius:12,padding:"8px 12px",marginBottom:14,textAlign:"center",border:"1px solid rgba(240,98,146,0.2)"}}>
                <div style={{fontSize:10,color:"#aaa",marginBottom:2}}>내 가족 코드</div>
                <div style={{fontSize:18,fontWeight:700,color:"#e91e63",letterSpacing:3}}>{newCode}</div>
                <div style={{fontSize:9,color:"#ccc",marginTop:1}}>비밀번호 설정 후 가족들과 공유하세요</div>
              </div>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:11,color:"#888",marginBottom:5}}>비밀번호 (숫자 4자리)</div>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value.slice(0,4))} placeholder="예: 1004" maxLength={4}
                  style={{width:"100%",padding:"13px",borderRadius:12,border:"2px solid rgba(240,98,146,0.3)",fontSize:20,outline:"none",textAlign:"center",letterSpacing:6,fontWeight:700,color:"#e91e63",background:"rgba(255,248,252,0.8)"}}/>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"#888",marginBottom:5}}>비밀번호 확인</div>
                <input type="password" value={password2} onChange={e=>{setPassword2(e.target.value.slice(0,4));setPwError('');}} placeholder="한 번 더 입력" maxLength={4}
                  style={{width:"100%",padding:"13px",borderRadius:12,border:`2px solid ${pwError?"#E53935":"rgba(240,98,146,0.3)"}`,fontSize:20,outline:"none",textAlign:"center",letterSpacing:6,fontWeight:700,color:"#e91e63",background:"rgba(255,248,252,0.8)"}}/>
              </div>
              {pwError&&<div style={{fontSize:12,color:"#E53935",marginBottom:10,textAlign:"center"}}>{pwError}</div>}
              <button onClick={createFamily} disabled={loading}
                style={{width:"100%",padding:"14px",borderRadius:14,border:"none",background:loading?"#f8bbd0":"linear-gradient(135deg,#f48fb1,#f06292)",color:"#fff",fontSize:15,fontWeight:700,cursor:loading?"default":"pointer",marginBottom:8,boxShadow:"0 4px 14px rgba(240,98,146,.25)"}}>
                {loading?"⏳ 만드는 중...":"✅ 완료! 가족 공간 만들기"}
              </button>
              <button onClick={()=>{setSetupStep(null);setPassword('');setPassword2('');setPwError('');}}
                style={{width:"100%",padding:"11px",borderRadius:14,border:"none",background:"rgba(245,245,245,0.8)",color:"#bbb",fontSize:13,cursor:"pointer"}}>← 뒤로</button>
            </div>
          </div>
        )}

        {/* 완료 - 코드 저장 안내 화면 */}
        {setupStep==='done' && (
          <div style={{width:"100%",maxWidth:340}}>
            <div style={{
              background:"rgba(255,255,255,0.88)",backdropFilter:"blur(16px)",
              borderRadius:24,padding:"1.8rem 1.6rem",
              border:"1px solid rgba(255,200,225,0.5)",
              boxShadow:"0 4px 20px rgba(240,98,146,.12)",
              textAlign:"center"
            }}>
              <div style={{fontSize:40,marginBottom:8}}>🎉</div>
              <div style={{fontFamily:"'Jua',sans-serif",fontSize:17,color:"#880e4f",marginBottom:6}}>
                가족 공간이 만들어졌어요!
              </div>
              <div style={{fontSize:12,color:"#aaa",marginBottom:16,lineHeight:1.6}}>
                아래 코드를 꼭 저장해두세요!<br/>
                나중에 다시 입장할 때 필요해요
              </div>

              {/* 코드 박스 */}
              <div style={{
                background:"linear-gradient(135deg,rgba(255,230,240,0.8),rgba(255,210,230,0.7))",
                borderRadius:18,padding:"16px",marginBottom:16,
                border:"2px solid rgba(240,98,146,0.25)"
              }}>
                <div style={{fontSize:11,color:"#aaa",marginBottom:6}}>내 가족 코드</div>
                <div style={{fontFamily:"'Jua',sans-serif",fontSize:26,color:"#e91e63",letterSpacing:4,marginBottom:8}}>
                  {newCode}
                </div>
                <div style={{fontSize:11,color:"#c2185b",lineHeight:1.6}}>
                  📌 이 코드를 카톡 "나에게 보내기"로<br/>저장해두세요!
                </div>
              </div>

              {/* 카톡 저장 버튼 */}
              <button onClick={()=>{
                const msg = `🌸 Baby Journey 가족 코드

내 가족 코드: ${newCode}

앱 링크: ${window.location.origin}

가족들에게 이 코드를 공유하면 실시간으로 볼 수 있어요!`;
                if(navigator.share) {
                  navigator.share({title:'Baby Journey 가족 코드', text:msg});
                } else {
                  navigator.clipboard.writeText(msg).then(()=>alert('복사됐어요! 카톡 "나에게 보내기"에 붙여넣기 하세요 💕'));
                }
              }} style={{
                width:"100%",padding:"13px",borderRadius:14,border:"none",
                background:"#FEE500",color:"#3C1E1E",
                fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:9,
                display:"flex",alignItems:"center",justifyContent:"center",gap:6,
                boxShadow:"0 4px 14px rgba(254,229,0,.4)"
              }}>
                <span style={{fontSize:18}}>💬</span> 카톡으로 코드 저장하기
              </button>

              {/* 앱 입장 버튼 */}
              <button onClick={()=>onEnter(newCode)} style={{
                width:"100%",padding:"13px",borderRadius:14,border:"none",
                background:"linear-gradient(135deg,#f48fb1,#f06292)",
                color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",
                boxShadow:"0 4px 14px rgba(240,98,146,.3)"
              }}>
                ✅ 앱 시작하기
              </button>

              <div style={{fontSize:10,color:"#ddd",marginTop:12,lineHeight:1.6}}>
                💡 앱 상단에서도 코드를 항상 확인할 수 있어요
              </div>
            </div>
          </div>
        )}

        {/* 코드 입력 화면 */}
        {mode==='join' && (
          <div style={{width:"100%",maxWidth:340}}>
            <div style={{
              background:"rgba(255,255,255,0.82)",
              backdropFilter:"blur(16px)",
              borderRadius:24,padding:"1.6rem",
              border:"1px solid rgba(255,200,225,0.5)",
              boxShadow:"0 4px 20px rgba(240,98,146,.1)",
            }}>
              <div style={{textAlign:"center",marginBottom:16}}>
                <div style={{fontSize:32,marginBottom:6}}>🔑</div>
                <div style={{fontSize:16,fontWeight:700,color:"#3d2c2c",marginBottom:3}}>가족 코드 입력</div>
                <div style={{fontSize:11,color:"#aaa"}}>엄마한테 받은 코드를 입력하세요</div>
              </div>
              <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())}
                placeholder="BABY-XXXX"
                maxLength={9}
                style={{width:"100%",padding:"15px",borderRadius:14,
                  border:"2px solid rgba(240,98,146,0.3)",
                  fontSize:20,outline:"none",textAlign:"center",
                  letterSpacing:4,fontWeight:700,color:"#e91e63",
                  marginBottom:10,background:"rgba(255,248,252,0.8)",
                }}
              />
              {error&&<div style={{fontSize:12,color:"#E53935",marginBottom:10,textAlign:"center",lineHeight:1.5}}>{error}</div>}
              <button onClick={joinFamily} disabled={loading}
                style={{width:"100%",padding:"14px",borderRadius:14,border:"none",
                  background:loading?"#f8bbd0":"linear-gradient(135deg,#f48fb1,#f06292)",
                  color:"#fff",fontSize:15,fontWeight:700,cursor:loading?"default":"pointer",
                  marginBottom:9,boxShadow:"0 4px 14px rgba(240,98,146,.25)",
                }}>
                {loading?"⏳ 확인 중...":"💕 참여하기"}
              </button>
              <button onClick={()=>{setMode(null);setError('');setCode('');}}
                style={{width:"100%",padding:"11px",borderRadius:14,border:"none",
                  background:"rgba(245,245,245,0.8)",color:"#bbb",fontSize:13,cursor:"pointer",
                }}>
                ← 뒤로
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── PIN 모달 ──────────────────────────────────────────────────
function PinModal({onSuccess,onClose,gender}) {
  const [inp,setInp]=useState(""); const [err,setErr]=useState(false);
  const hit=d=>{
    if(inp.length>=4)return;
    const nx=inp+d;
    setInp(nx);
    if(nx.length===4){
      const check=async()=>{
        try{
          const res=await window.storage.get("pgApp_state",true);
          const s=res?JSON.parse(res.value):{};
          nx===(s.pin||"1234")?onSuccess():(setErr(true),setTimeout(()=>{setInp("");setErr(false);},700));
        }catch(e){
          nx==="1234"?onSuccess():(setErr(true),setTimeout(()=>{setInp("");setErr(false);},700));
        }
      };
      check();
    }
  };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
      <div style={{background:"#fff",borderRadius:28,padding:"2rem 2.2rem",textAlign:"center",boxShadow:"0 24px 64px rgba(0,0,0,.18)",minWidth:286}}>
        <BabyWriting size={70} gender={gender}/>
        <div style={{fontSize:16,fontWeight:700,color:"#3d2c2c",marginBottom:2,marginTop:4}}>엄마 전용 비밀번호 입력</div>
        <div style={{fontSize:12,color:"#aaa",marginBottom:18}}>비밀번호 4자리를 눌러주세요</div>
        <div style={{display:"flex",gap:11,justifyContent:"center",marginBottom:18}}>
          {[0,1,2,3].map(i=><div key={i} style={{width:14,height:14,borderRadius:"50%",border:"2px solid #f8bbd0",background:inp.length>i?(err?"#ef9a9a":"#f06292"):"transparent",transition:"background .15s"}}/>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:9}}>
          {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((d,i)=>(
            <button key={i} onClick={()=>d==="⌫"?setInp(p=>p.slice(0,-1)):d!==""&&hit(String(d))}
              style={{padding:"12px 0",borderRadius:12,border:"1.5px solid #f5e6e6",background:d===""?"transparent":"#fff",fontSize:17,fontWeight:600,color:"#3d2c2c",cursor:d===""?"default":"pointer"}}
              onMouseOver={e=>d!==""&&(e.target.style.background="#fce4ec")}
              onMouseOut={e=>e.target.style.background=d===""?"transparent":"#fff"}
            >{d}</button>
          ))}
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#bbb",fontSize:12,cursor:"pointer"}}>취소</button>
      </div>
    </div>
  );
}

// ── 상태 카드 ─────────────────────────────────────────────────
function StatusCard({state}) {
  const sev=calcSev(state.conditions);
  const info=SEV_INFO[sev];
  const active=ALL_SYM.filter(s=>state.conditions?.includes(s.id));
  const g = state.gender || "unknown";
  return (
    <div style={{background:info.bg,borderRadius:22,padding:"1.3rem",marginBottom:13,border:`2px solid ${info.color}44`}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:9}}>
        <div style={{flex:1}}>
          <div style={{fontSize:11,color:"#999",marginBottom:3}}>오늘 엄마 컨디션</div>
          <div style={{fontSize:17,fontWeight:700,color:info.color,marginBottom:5}}>{info.label}</div>
          {info.action&&<div style={{display:"inline-block",background:info.color,color:"#fff",borderRadius:10,padding:"4px 11px",fontSize:11,fontWeight:700,marginBottom:5}}>{info.action}</div>}
        </div>
        <div style={{flexShrink:0,marginLeft:8}}>
          {sev>=4?<BabySick gender={g}/>:sev<=1&&state.conditions?.length>0?<BabyHappy gender={g}/>:<BabyNeutral gender={g}/>}
        </div>
      </div>
      <div style={{marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#aaa",marginBottom:4}}>
          <span>컨디션 지수</span><span style={{color:info.color,fontWeight:700}}>{sev===0?"미기록":`${sev}/5`}</span>
        </div>
        <div style={{display:"flex",gap:4}}>{[1,2,3,4,5].map(i=><div key={i} style={{flex:1,height:11,borderRadius:6,background:sev>=i?info.color:"#EEE",transition:"background .4s"}}/>)}</div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#ccc",marginTop:3}}><span>😊 최고</span><span>😢 힘듦</span></div>
      </div>
      <div style={{background:"rgba(255,255,255,0.65)",borderRadius:12,padding:"9px 12px",fontSize:12,color:"#555",lineHeight:1.6,marginBottom:active.length?9:0}}>💬 {info.msg}</div>
      {active.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:5}}>{active.map(s=><span key={s.id} style={{background:"rgba(255,255,255,.85)",border:`1.5px solid ${s.sev>=4?"#E53935":s.sev>=3?"#FB8C00":s.sev>=2?"#FFB300":"#66BB6A"}`,borderRadius:18,padding:"3px 9px",fontSize:11,fontWeight:700,color:s.sev>=4?"#B71C1C":s.sev>=3?"#E65100":s.sev>=2?"#E65100":"#2E7D32"}}>{s.emoji} {s.label}</span>)}</div>}
    </div>
  );
}

// ── 여정 타임라인 ─────────────────────────────────────────────
function JourneyLine({week}) {
  const pct=Math.min(100,(week/40)*100);
  const ms=[0,5,10,15,20,25,30,35,40];
  return (
    <div className="glass-card" style={{borderRadius:22,padding:"1.3rem 1.1rem",marginBottom:13}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:14,fontWeight:700,color:"#3d2c2c"}}>🛤️ 아기에게 가는 여정</div>
        <div style={{fontSize:12,color:"#f06292",fontWeight:700}}>{week}주 / 40주</div>
      </div>
      <div style={{position:"relative",marginBottom:8,paddingRight:16}}>
        <div style={{height:14,background:"rgba(235,220,230,0.35)",borderRadius:10,overflow:"visible",position:"relative"}}>
          <div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,#fce4ec,#f06292)",borderRadius:10,transition:"width 1s ease",position:"relative"}}>
            <div style={{position:"absolute",right:-16,top:"50%",transform:"translateY(-50%)",fontSize:22}}>🤰</div>
          </div>
        </div>
        <div style={{position:"absolute",right:-8,top:"50%",transform:"translateY(-60%)",fontSize:20}}>🍼</div>
      </div>
      <div style={{position:"relative",height:34,marginTop:4}}>
        {ms.map(m=>{
          const pos=(m/40)*100; const isCur=week>=m&&week<(m===40?41:m+5); const isPast=week>m;
          return (
            <div key={m} style={{position:"absolute",left:`${pos}%`,transform:"translateX(-50%)",textAlign:"center"}}>
              <div style={{width:2,height:7,background:isPast?"#f06292":"#E0E0E0",margin:"0 auto 2px"}}/>
              <div style={{fontSize:10,fontWeight:isCur?700:400,color:isCur?"#f06292":isPast?"#f8bbd0":"#CCC",whiteSpace:"nowrap"}}>
                {m===0?"시작":m===40?"탄생!":m+"주"}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{textAlign:"center",fontSize:12,color:"#bbb",marginTop:2}}>출산까지 <span style={{color:"#f06292",fontWeight:700}}>{40-week}주</span> 남았어요!</div>
    </div>
  );
}

// ── 홈 탭 ─────────────────────────────────────────────────────
function HomeTab({state}) {
  const w=state.week; const d=WEEKLY_DATA[w]||WEEKLY_DATA[16];
  const daysLeft=state.dueDate?Math.max(0,Math.round((new Date(state.dueDate)-new Date())/86400000)):null;
  const tri=w<=12?"1분기":w<=27?"2분기":"3분기";
  const g=state.gender||"unknown";
  return (
    <div style={{paddingBottom:"2rem"}}>
      <div style={{background:"linear-gradient(135deg,#fff0f5 0%,#fde8f2 50%,#fad5e8 100%)",borderRadius:24,padding:"1.5rem",marginBottom:13,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-8,right:-8,opacity:.08,fontSize:80}}>🌸</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:12,color:"#ad1457",marginBottom:3}}>{tri} · {w}주차</div>
            <div style={{fontSize:20,fontWeight:700,color:"#880e4f",lineHeight:1.3,marginBottom:7}}>
              {state.momName||"예비 엄마"}의<br/>소중한 여정 🤰
            </div>
            {daysLeft!==null&&<div style={{display:"inline-block",background:"rgba(255,255,255,.65)",borderRadius:18,padding:"4px 12px",fontSize:12,color:"#880e4f",fontWeight:700}}>출산까지 D-{daysLeft}</div>}
            {state.dueDate&&(
              <div style={{marginTop:6,display:"flex",alignItems:"center",gap:5}}>
                <span style={{fontSize:11,color:"rgba(136,14,79,0.7)"}}>📅 출산 예정일</span>
                <span style={{fontSize:13,fontWeight:700,color:"#880e4f",background:"rgba(255,255,255,0.55)",borderRadius:10,padding:"2px 9px"}}>
                  {new Date(state.dueDate).toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric"})}
                </span>
              </div>
            )}
            {state.babyName&&<div style={{fontSize:12,color:"#c2185b",marginTop:4}}>태명: {state.babyName} 💕</div>}
          </div>
          <BabyInWomb size={98} gender={g}/>
        </div>
      </div>
      <StatusCard state={state}/>
      <JourneyLine week={w}/>
      {state.memo&&<div className="glass-card-yellow" style={{borderRadius:16,padding:"1rem 1.2rem",marginBottom:13,border:"1.5px solid rgba(255,240,100,0.5)"}}>
        <div style={{fontSize:11,color:"#f9a825",fontWeight:700,marginBottom:3}}>💌 엄마의 한마디</div>
        <div style={{fontSize:13,color:"#555",lineHeight:1.6}}>{state.memo}</div>
      </div>}
      {(state.hospital || (state.appointments||[]).length > 0) && (
        <div className="glass-card-blue" style={{borderRadius:16,padding:"1rem 1.2rem",marginBottom:13,border:"1px solid rgba(180,220,255,0.6)"}}>
          {state.hospital && (
            <div style={{marginBottom:(state.appointments||[]).filter(a=>a.date>=new Date().toISOString().split("T")[0]).length>0?8:0}}>
              <div style={{fontSize:11,color:"#1565C0",fontWeight:700,marginBottom:2}}>🏥 다니는 병원</div>
              <div style={{fontSize:14,fontWeight:700,color:"#0D47A1"}}>{state.hospital.name}</div>
            </div>
          )}
          {(() => {
            const today = new Date().toISOString().split("T")[0];
            const next = (state.appointments||[]).filter(a=>a.date>=today).sort((a,b)=>a.date.localeCompare(b.date))[0];
            if(!next) return null;
            const d = new Date(next.date);
            const diff = Math.round((new Date(next.date)-new Date(today))/86400000);
            return (
              <div style={{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.5)",borderRadius:12,padding:"8px 10px"}}>
                <div style={{textAlign:"center",flexShrink:0}}>
                  <div style={{fontSize:9,color:"#f06292",fontWeight:700}}>{d.getMonth()+1}월</div>
                  <div style={{fontSize:20,fontWeight:700,color:"#e91e63",lineHeight:1}}>{d.getDate()}</div>
                  <div style={{fontSize:9,color:"#f48fb1"}}>{["일","월","화","수","목","금","토"][d.getDay()]}요일</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,color:"#888",marginBottom:1}}>📌 다음 진료</div>
                  <div style={{fontSize:13,fontWeight:700,color:"#3d2c2c"}}>{next.purpose}</div>
                </div>
                <div style={{
                  background:diff===0?"#f06292":diff===1?"#FF7043":"rgba(240,98,146,0.12)",
                  color:diff<=1?"#fff":"#f06292",
                  borderRadius:10,padding:"3px 9px",fontSize:11,fontWeight:700,flexShrink:0
                }}>
                  {diff===0?"오늘!":diff===1?"내일":`D-${diff}`}
                </div>
              </div>
            );
          })()}
        </div>
      )}
      <div className="glass-card" style={{borderRadius:18,padding:"1.2rem",marginBottom:13,display:"flex",gap:12,alignItems:"center"}}>
        <div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#fff2f7,#fde8f2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>{d.emoji}</div>
        <div>
          <div style={{fontSize:11,color:"#f06292",fontWeight:700,marginBottom:1}}>이번 주 아기 크기</div>
          <div style={{fontSize:16,fontWeight:700,color:"#3d2c2c",marginBottom:1}}>{d.size} 만해요</div>
          <div style={{fontSize:11,color:"#999"}}>약 {d.sizeCm}</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
        <div className="glass-card-pink" style={{borderRadius:16,padding:".9rem"}}>
          <div style={{fontSize:11,color:"#f06292",fontWeight:700,marginBottom:5}}>👶 아기</div>
          <div style={{fontSize:12,color:"#3d2c2c",lineHeight:1.6}}>{d.babyDesc}</div>
        </div>
        <div style={{borderRadius:16,padding:".9rem"}}>
          <div style={{fontSize:11,color:"#64b5f6",fontWeight:700,marginBottom:5}}>🤰 엄마 몸</div>
          <div style={{fontSize:12,color:"#3d2c2c",lineHeight:1.6}}>{d.momDesc}</div>
        </div>
      </div>
    </div>
  );
}

// ── 주수 탭 ───────────────────────────────────────────────────
function WeekTab({state}) {
  const [sel,setSel]=useState(state.week); const d=WEEKLY_DATA[sel]||WEEKLY_DATA[16];
  const g=state.gender||"unknown";
  const groups=[{label:"1분기 (4~12주)",weeks:Array.from({length:9},(_,i)=>i+4),color:"#f48fb1"},{label:"2분기 (13~27주)",weeks:Array.from({length:15},(_,i)=>i+13),color:"#66BB6A"},{label:"3분기 (28~40주)",weeks:Array.from({length:13},(_,i)=>i+28),color:"#64b5f6"}];
  return (
    <div style={{paddingBottom:"2rem"}}>
      <div style={{fontSize:16,fontWeight:700,color:"#3d2c2c",marginBottom:11}}>주수별 변화</div>
      <div style={{background:"linear-gradient(135deg,#fff2f7,#fde8f2)",borderRadius:20,padding:"1.2rem",marginBottom:14,display:"flex",gap:12,alignItems:"center"}}>
        <BabyReading size={82} gender={g}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12,color:"#ad1457",fontWeight:700,marginBottom:2}}>{sel}주차 · {d.sizeCm}</div>
          <div style={{fontSize:15,fontWeight:700,color:"#880e4f",marginBottom:6}}>{d.size} 크기</div>
          <div style={{background:"rgba(255,255,255,.55)",borderRadius:9,padding:"6px 9px",fontSize:11,marginBottom:4}}>👶 {d.babyDesc}</div>
          <div style={{background:"rgba(255,255,255,.55)",borderRadius:9,padding:"6px 9px",fontSize:11}}>🤰 {d.momDesc}</div>
        </div>
      </div>
      {groups.map(gr=>(
        <div key={gr.label} style={{marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,color:gr.color,marginBottom:7}}>{gr.label}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {gr.weeks.filter(w=>WEEKLY_DATA[w]).map(w=>(
              <button key={w} onClick={()=>setSel(w)} style={{width:40,height:40,borderRadius:11,border:"2px solid",borderColor:sel===w?gr.color:"#f0f0f0",background:sel===w?gr.color:w===state.week?"rgba(255,230,240,0.8)":"rgba(255,255,255,0.65)",color:sel===w?"#fff":"#3d2c2c",fontSize:12,fontWeight:700,cursor:"pointer",position:"relative"}}>
                {w}{w===state.week&&<span style={{position:"absolute",top:-5,right:-5,fontSize:8}}>📍</span>}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 음식 탭 ───────────────────────────────────────────────────
function FoodTab({state,onUpdate}) {
  const [view,setView]=useState("all");
  const ratings=state.foodRatings||{};
  const g=state.gender||"unknown";
  const setR=(id,v)=>{const n={...ratings};n[id]===v?delete n[id]:n[id]=v;onUpdate({foodRatings:n});};
  const cats=[...new Set(FOOD_ITEMS.map(f=>f.cat))];
  const liked=FOOD_ITEMS.filter(f=>ratings[f.id]==="good");
  const disliked=FOOD_ITEMS.filter(f=>ratings[f.id]==="bad");
  const badgeColor = {
    "단백질":"#EF9A9A","철분":"#E57373","칼슘":"#90CAF9","오메가3":"#80DEEA",
    "엽산":"#A5D6A7","비타민":"#FFD54F","칼륨":"#CE93D8","유산균":"#80CBC4",
    "식이섬유":"#BCAAA4","탄수화물":"#FFF176",
  };
  const FoodCard=({item})=>{const r=ratings[item.id];return(
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid rgba(0,0,0,0.05)"}}>
      {/* 이모지 아이콘 */}
      <div style={{width:40,height:40,borderRadius:12,background:item.danger?"rgba(255,230,230,0.7)":item.warn?"rgba(255,245,220,0.7)":"rgba(255,255,255,0.7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,border:"1px solid rgba(0,0,0,0.05)"}}>
        {item.emoji}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2,flexWrap:"wrap"}}>
          <span style={{fontSize:13,fontWeight:700,color:item.danger?"#B71C1C":item.warn?"#E65100":"#3d2c2c"}}>{item.name}</span>
          {item.badge&&!item.warn&&!item.danger&&(
            <span style={{fontSize:9,background:badgeColor[item.badge]||"#E0E0E0",color:"#444",borderRadius:6,padding:"1px 5px",fontWeight:700,flexShrink:0}}>{item.badge}</span>
          )}
          {item.warn&&<span style={{fontSize:9,background:"#FFE082",color:"#E65100",borderRadius:6,padding:"1px 5px",fontWeight:700}}>주의</span>}
          {item.danger&&<span style={{fontSize:9,background:"#EF9A9A",color:"#B71C1C",borderRadius:6,padding:"1px 5px",fontWeight:700}}>금지</span>}
        </div>
        <div style={{fontSize:11,color:"#999",lineHeight:1.4}}>{item.tip}</div>
      </div>
      {!item.danger&&<div style={{display:"flex",gap:5,flexShrink:0}}>
        <button onClick={()=>setR(item.id,"good")} style={{width:32,height:32,borderRadius:9,border:"2px solid",borderColor:r==="good"?"#66BB6A":"#eee",background:r==="good"?"rgba(220,248,230,0.9)":"rgba(255,255,255,0.55)",fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>👍</button>
        <button onClick={()=>setR(item.id,"bad")} style={{width:32,height:32,borderRadius:9,border:"2px solid",borderColor:r==="bad"?"#EF9A9A":"#eee",background:r==="bad"?"rgba(255,235,235,0.9)":"rgba(255,255,255,0.55)",fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>👎</button>
      </div>}
      {item.danger&&<div style={{width:32,height:32,borderRadius:9,background:"rgba(255,220,220,0.6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🚫</div>}
    </div>
  );};
  return (
    <div style={{paddingBottom:"2rem"}}>
      <div style={{background:"linear-gradient(135deg,#f2fbf5,#e4f6ea)",borderRadius:22,padding:"1.1rem",marginBottom:13,display:"flex",alignItems:"center",gap:12}}>
        <BabyEating size={80} gender={g}/>
        <div>
          <div style={{fontSize:16,fontWeight:700,color:"#2E7D32",marginBottom:1}}>임산부 음식 가이드</div>
          <div style={{fontSize:11,color:"#558B2F"}}>👍👎 직접 평가해보세요!</div>
        </div>
      </div>
      {(liked.length>0||disliked.length>0)&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        <div className="glass-card-green" style={{borderRadius:14,padding:"10px",textAlign:"center"}}><div style={{fontSize:20,marginBottom:2}}>👍</div><div style={{fontSize:12,fontWeight:700,color:"#2E7D32"}}>{liked.length}가지 좋아요</div></div>
        <div className="glass-card-pink" style={{borderRadius:14,padding:"10px",textAlign:"center"}}><div style={{fontSize:20,marginBottom:2}}>👎</div><div style={{fontSize:12,fontWeight:700,color:"#C62828"}}>{disliked.length}가지 싫어요</div></div>
      </div>}
      <div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto",paddingBottom:3}}>
        {[{id:"all",label:"전체"},{id:"good",label:"👍 좋아요"},{id:"bad",label:"👎 싫어요"}].map(t=>(
          <button key={t.id} onClick={()=>setView(t.id)} style={{flexShrink:0,padding:"7px 14px",borderRadius:20,border:"2px solid",borderColor:view===t.id?"#f06292":"#eee",background:view===t.id?"rgba(255,210,235,0.8)":"rgba(255,255,255,0.55)",color:view===t.id?"#e91e63":"#888",fontSize:12,fontWeight:700,cursor:"pointer"}}>{t.label}</button>
        ))}
      </div>
      {view==="good"&&liked.length===0&&<div style={{textAlign:"center",padding:"2rem",color:"#ccc",fontSize:13}}>아직 좋아요 한 음식이 없어요</div>}
      {view==="bad"&&disliked.length===0&&<div style={{textAlign:"center",padding:"2rem",color:"#ccc",fontSize:13}}>아직 싫어요 한 음식이 없어요</div>}
      {cats.map(cat=>{
        const items=FOOD_ITEMS.filter(f=>f.cat===cat);
        const filtered=view==="good"?items.filter(f=>ratings[f.id]==="good"):view==="bad"?items.filter(f=>ratings[f.id]==="bad"):items;
        if(!filtered.length) return null;
        const catColor = cat.includes("🚫")?"#E53935":cat.includes("⚠️")?"#FB8C00":cat.includes("🌾")?"#8D6E63":cat.includes("🥦")?"#43A047":cat.includes("🍎")?"#E91E63":cat.includes("🥩")?"#EF5350":cat.includes("🥛")?"#1E88E5":cat.includes("🫐")?"#7B1FA2":"#2E7D32";
        return <div key={cat} className="glass-card" style={{borderRadius:18,padding:"1rem 1.1rem",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:4,height:18,borderRadius:2,background:catColor,flexShrink:0}}/>
              <span style={{fontSize:13,fontWeight:700,color:catColor}}>{cat}</span>
            </div>
            <span style={{fontSize:10,background:`${catColor}20`,color:catColor,borderRadius:8,padding:"2px 7px",fontWeight:700}}>{filtered.length}가지</span>
          </div>
          {filtered.map(item=><FoodCard key={item.id} item={item}/>)}
        </div>;
      })}
    </div>
  );
}

// ── 진료 일정 컴포넌트 ───────────────────────────────────────
function AppointmentSection({state, onUpdate, isUnlocked}) {
  const appointments = state.appointments || [];
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({date:"", purpose:"", memo:""});

  const QUICK_PURPOSES = [
    "정기 검진","기형아 검사","초음파 검사","혈액 검사",
    "임신성 당뇨 검사","정밀 초음파","GBS 검사","분만 상담","기타",
  ];

  const addAppt = () => {
    if(!form.date || !form.purpose) return;
    const newAppt = {
      id: Date.now(),
      date: form.date,
      purpose: form.purpose,
      memo: form.memo,
    };
    onUpdate({appointments:[...appointments, newAppt].sort((a,b)=>a.date.localeCompare(b.date))});
    setForm({date:"", purpose:"", memo:""});
    setShowForm(false);
  };

  const deleteAppt = (id) => {
    onUpdate({appointments: appointments.filter(a=>a.id!==id)});
  };

  const today = new Date().toISOString().split("T")[0];

  // 지난 일정 / 앞으로 일정 분리
  const upcoming = appointments.filter(a=>a.date>=today);
  const past     = appointments.filter(a=>a.date< today);

  const ApptCard = ({appt, isPast}) => {
    const d = new Date(appt.date);
    const month = d.getMonth()+1;
    const day   = d.getDate();
    const weekDay = ["일","월","화","수","목","금","토"][d.getDay()];
    const dDiff = Math.round((new Date(appt.date)-new Date(today))/86400000);
    return (
      <div style={{
        display:"flex", gap:12, alignItems:"flex-start",
        padding:"12px 0",
        borderBottom:"1px solid rgba(0,0,0,0.05)",
        opacity: isPast ? 0.55 : 1,
      }}>
        {/* 날짜 박스 */}
        <div style={{
          flexShrink:0, width:48, textAlign:"center",
          background: isPast ? "rgba(200,200,200,0.25)" : "linear-gradient(135deg,rgba(240,98,146,0.12),rgba(240,98,146,0.06))",
          borderRadius:14, padding:"7px 4px",
          border:`1.5px solid ${isPast?"rgba(200,200,200,0.3)":"rgba(240,98,146,0.2)"}`,
        }}>
          <div style={{fontSize:10, color: isPast?"#aaa":"#f06292", fontWeight:700}}>{month}월</div>
          <div style={{fontSize:22, fontWeight:700, color: isPast?"#bbb":"#e91e63", lineHeight:1.1}}>{day}</div>
          <div style={{fontSize:10, color: isPast?"#ccc":"#f48fb1"}}>{weekDay}요일</div>
        </div>
        {/* 내용 */}
        <div style={{flex:1}}>
          <div style={{display:"flex", alignItems:"center", gap:6, marginBottom:3}}>
            <span style={{fontSize:14, fontWeight:700, color: isPast?"#aaa":"#3d2c2c"}}>{appt.purpose}</span>
            {!isPast && dDiff===0 && <span style={{fontSize:10,background:"#f06292",color:"#fff",borderRadius:8,padding:"1px 7px",fontWeight:700}}>오늘!</span>}
            {!isPast && dDiff===1 && <span style={{fontSize:10,background:"#FF7043",color:"#fff",borderRadius:8,padding:"1px 7px",fontWeight:700}}>내일</span>}
            {!isPast && dDiff>1  && <span style={{fontSize:10,background:"rgba(240,98,146,0.12)",color:"#f06292",borderRadius:8,padding:"1px 7px",fontWeight:600}}>D-{dDiff}</span>}
            {isPast && <span style={{fontSize:10,background:"rgba(150,150,150,0.15)",color:"#bbb",borderRadius:8,padding:"1px 7px"}}>완료</span>}
          </div>
          {appt.memo && <div style={{fontSize:11,color:"#aaa",lineHeight:1.4}}>{appt.memo}</div>}
          <div style={{fontSize:10,color:"#ccc",marginTop:2}}>{state.hospital?.name || "병원 미등록"}</div>
        </div>
        {/* 삭제 (엄마만) */}
        {isUnlocked && (
          <button onClick={()=>deleteAppt(appt.id)} style={{
            flexShrink:0, background:"none", border:"none",
            fontSize:16, cursor:"pointer", color:"#ddd", padding:"2px 0",
          }}>✕</button>
        )}
      </div>
    );
  };

  return (
    <div className="glass-card" style={{borderRadius:22,padding:"1.3rem",marginBottom:13}}>
      {/* 헤더 */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <span style={{fontSize:20}}>🗓️</span>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#3d2c2c"}}>병원 진료 일정</div>
            <div style={{fontSize:10,color:"#aaa"}}>가족들이 언제 병원 가는지 알 수 있어요</div>
          </div>
        </div>
        {isUnlocked && !showForm && (
          <button onClick={()=>setShowForm(true)} style={{
            background:"linear-gradient(135deg,#fce4ec,#f8bbd0)",
            border:"none",borderRadius:12,padding:"7px 13px",
            fontSize:12,fontWeight:700,color:"#e91e63",cursor:"pointer",
            display:"flex",alignItems:"center",gap:4,flexShrink:0,
          }}>
            <span>＋</span> 추가
          </button>
        )}
      </div>

      {/* 추가 폼 */}
      {isUnlocked && showForm && (
        <div style={{
          background:"rgba(255,240,248,0.7)",borderRadius:16,
          padding:"1rem",marginBottom:12,
          border:"1.5px solid rgba(240,98,146,0.2)",
        }}>
          <div style={{fontSize:12,fontWeight:700,color:"#e91e63",marginBottom:10}}>📋 진료 일정 추가</div>

          {/* 날짜 선택 */}
          <div style={{marginBottom:10}}>
            <div style={{fontSize:11,color:"#888",marginBottom:4}}>📅 방문 날짜</div>
            <input type="date" value={form.date} min={today}
              onChange={e=>setForm(p=>({...p,date:e.target.value}))}
              style={{width:"100%",padding:"10px 12px",borderRadius:11,border:"1.5px solid rgba(240,98,146,0.3)",fontSize:13,outline:"none",background:"#fff",color:"#3d2c2c"}}/>
          </div>

          {/* 방문 목적 - 퀵 버튼 */}
          <div style={{marginBottom:10}}>
            <div style={{fontSize:11,color:"#888",marginBottom:6}}>🏥 방문 목적</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:7}}>
              {QUICK_PURPOSES.map(p=>(
                <button key={p} onClick={()=>setForm(prev=>({...prev,purpose:p}))}
                  style={{
                    padding:"5px 10px",borderRadius:20,border:"1.5px solid",fontSize:11,cursor:"pointer",fontWeight:600,
                    borderColor:form.purpose===p?"#f06292":"rgba(240,98,146,0.2)",
                    background:form.purpose===p?"#fce4ec":"rgba(255,255,255,0.7)",
                    color:form.purpose===p?"#e91e63":"#888",
                  }}>
                  {p}
                </button>
              ))}
            </div>
            <input value={form.purpose} onChange={e=>setForm(p=>({...p,purpose:e.target.value}))}
              placeholder="직접 입력..."
              style={{width:"100%",padding:"9px 12px",borderRadius:11,border:"1.5px solid rgba(240,98,146,0.3)",fontSize:13,outline:"none",background:"#fff",color:"#3d2c2c"}}/>
          </div>

          {/* 메모 */}
          <div style={{marginBottom:12}}>
            <div style={{fontSize:11,color:"#888",marginBottom:4}}>💬 메모 (선택)</div>
            <input value={form.memo} onChange={e=>setForm(p=>({...p,memo:e.target.value}))}
              placeholder="예: 공복으로 방문해야 함, 남편 동행 등"
              style={{width:"100%",padding:"9px 12px",borderRadius:11,border:"1.5px solid rgba(240,98,146,0.2)",fontSize:12,outline:"none",background:"#fff",color:"#555"}}/>
          </div>

          <div style={{display:"flex",gap:8}}>
            <button onClick={addAppt} disabled={!form.date||!form.purpose}
              style={{
                flex:1,padding:"11px",borderRadius:12,border:"none",
                background:form.date&&form.purpose?"linear-gradient(135deg,#f48fb1,#f06292)":"#eee",
                color:form.date&&form.purpose?"#fff":"#bbb",
                fontSize:13,fontWeight:700,cursor:form.date&&form.purpose?"pointer":"default",
              }}>
              ✅ 저장
            </button>
            <button onClick={()=>{setShowForm(false);setForm({date:"",purpose:"",memo:""}); }}
              style={{flex:1,padding:"11px",borderRadius:12,border:"none",background:"#f5f5f5",color:"#aaa",fontSize:13,cursor:"pointer"}}>
              취소
            </button>
          </div>
        </div>
      )}

      {/* 앞으로 일정 */}
      {upcoming.length > 0 ? (
        <div>
          <div style={{fontSize:11,fontWeight:700,color:"#f06292",marginBottom:4,paddingBottom:4,borderBottom:"1px solid rgba(240,98,146,0.1)"}}>
            📌 예정된 일정 ({upcoming.length}건)
          </div>
          {upcoming.map(a=><ApptCard key={a.id} appt={a} isPast={false}/>)}
        </div>
      ) : (
        <div style={{textAlign:"center",padding:"1.5rem 0"}}>
          <div style={{fontSize:32,marginBottom:6}}>🗓️</div>
          <div style={{fontSize:13,color:"#ccc"}}>
            {isUnlocked ? "＋ 추가 버튼으로 진료 일정을 등록해보세요" : "아직 등록된 일정이 없어요"}
          </div>
        </div>
      )}

      {/* 지난 일정 */}
      {past.length > 0 && (
        <details style={{marginTop:10}}>
          <summary style={{fontSize:11,color:"#ccc",cursor:"pointer",listStyle:"none",padding:"6px 0",borderTop:"1px solid rgba(0,0,0,0.05)"}}>
            ▸ 지난 일정 ({past.length}건)
          </summary>
          <div style={{paddingTop:4}}>
            {[...past].reverse().map(a=><ApptCard key={a.id} appt={a} isPast={true}/>)}
          </div>
        </details>
      )}
    </div>
  );
}

// ── 금지사항 섹션 컴포넌트 ──────────────────────────────────
function CautionSection({sec}) {
  const [open,setOpen] = useState(false);
  return (
    <div style={{marginBottom:10}}>
      <button onClick={()=>setOpen(p=>!p)} style={{
        width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"10px 12px",borderRadius:14,border:`1.5px solid ${sec.border}`,
        background:sec.bg,cursor:"pointer",textAlign:"left",
      }}>
        <span style={{fontSize:13,fontWeight:700,color:sec.color}}>{sec.cat}</span>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:10,background:`${sec.color}18`,color:sec.color,borderRadius:8,padding:"2px 7px",fontWeight:700}}>{sec.items.length}가지</span>
          <span style={{fontSize:12,color:sec.color,transition:"transform .2s",display:"inline-block",transform:open?"rotate(180deg)":"rotate(0deg)"}}>▼</span>
        </div>
      </button>
      {open&&(
        <div style={{padding:"4px 4px 0"}}>
          {sec.items.map((item,i)=>(
            <div key={i} style={{
              display:"flex",gap:10,alignItems:"flex-start",
              padding:"10px 12px",
              borderBottom:i<sec.items.length-1?`1px solid ${sec.border}`:"none",
              background:"rgba(255,255,255,0.5)",
              borderRadius:i===0?"0 0 0 0":i===sec.items.length-1?"0 0 12px 12px":"0",
            }}>
              <span style={{fontSize:22,flexShrink:0,lineHeight:1.2}}>{item.emoji}</span>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:sec.color,marginBottom:2}}>{item.title}</div>
                <div style={{fontSize:11,color:"#666",lineHeight:1.6}}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 케어 탭 ───────────────────────────────────────────────────
function CareTab({state,onUpdate}) {
  const [q,setQ]=useState("");
  const [region,setRegion]=useState("");
  const [showSearch,setShowSearch]=useState(false);
  const g=state.gender||"unknown";
  const openNaverMap=(keyword)=>window.open(`https://map.naver.com/v5/search/${encodeURIComponent(keyword)}`,"_blank");
  const registerHospital=()=>{
    if(!q.trim()) return;
    const searchQuery = region.trim() ? `${q.trim()} ${region.trim()}` : q.trim();
    onUpdate({hospital:{name:q.trim(), region:region.trim(), naverQuery:searchQuery}});
    setQ(""); setRegion(""); setShowSearch(false);
  };
  const today=new Date().toDateString();
  const checked=state.checkDate===today?(state.checkToday||{}):{};
  const toggle=id=>{const n={...checked,[id]:!checked[id]};onUpdate({checkToday:n,checkDate:today});};
  const done=Object.values(checked).filter(Boolean).length;
  return (
    <div style={{paddingBottom:"2rem"}}>
      <div className="glass-card" style={{borderRadius:22,padding:"1.3rem",marginBottom:13}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <BabyDoctor size={70} gender={g}/>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#1565C0"}}>🏥 다니는 병원</div>
            <div style={{fontSize:11,color:"#aaa",lineHeight:1.5}}>네이버 지도에서 확인 후 등록해요</div>
          </div>
        </div>
        {state.hospital&&!showSearch?(
          <div style={{background:"linear-gradient(135deg,rgba(200,230,255,0.7),rgba(180,215,255,0.6))",backdropFilter:"blur(10px)",borderRadius:18,padding:"1.1rem",border:"1px solid rgba(180,220,255,0.5)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontSize:11,color:"#1565C0",fontWeight:700,marginBottom:3}}>📍 등록된 병원</div>
                <div style={{fontSize:17,fontWeight:700,color:"#0D47A1"}}>{state.hospital.name}</div>
              </div>
              <button onClick={()=>onUpdate({hospital:null})} style={{background:"rgba(255,255,255,0.6)",border:"none",borderRadius:8,width:28,height:28,fontSize:13,cursor:"pointer",color:"#90CAF9",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>openNaverMap(state.hospital.naverQuery||state.hospital.name)}
                style={{flex:1,padding:"11px 0",borderRadius:12,border:"none",background:"#03C75A",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                <span>🗺️</span> 네이버 지도 열기
              </button>
              <button onClick={()=>setShowSearch(true)}
                style={{flex:1,padding:"11px 0",borderRadius:12,border:"2px solid #BBDEFB",background:"#fff",color:"#1565C0",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                <span>🔄</span> 병원 변경
              </button>
            </div>
          </div>
        ):(
          <div>
            <div style={{background:"rgba(220,248,235,0.65)",borderRadius:14,padding:"11px 13px",marginBottom:11,border:"1px solid rgba(160,220,190,0.5)"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#2E7D32",marginBottom:5}}>📋 등록 방법</div>
              <div style={{fontSize:11,color:"#555",lineHeight:1.9}}>
                1️⃣ 병원명을 입력하세요<br/>
                2️⃣ 🗺️ 버튼으로 네이버 지도에서 위치 확인<br/>
                3️⃣ ✅ 버튼으로 이 앱에 등록
              </div>
            </div>
            {/* 병원명 */}
            <div style={{marginBottom:8}}>
              <div style={{fontSize:11,color:"#888",marginBottom:4}}>🏥 병원명</div>
              <input value={q} onChange={e=>setQ(e.target.value)}
                placeholder="예: 더블유여성병원"
                style={{width:"100%",padding:"12px 14px",borderRadius:13,border:"1.5px solid #BBDEFB",fontSize:13,outline:"none",color:"#3d2c2c",background:"#F8FBFF"}}/>
            </div>
            {/* 지역 */}
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11,color:"#888",marginBottom:4}}>📍 지역 (시·구까지 입력)</div>
              <input value={region} onChange={e=>setRegion(e.target.value)}
                placeholder="예: 광주 광산구"
                style={{width:"100%",padding:"12px 14px",borderRadius:13,border:"1.5px solid #BBDEFB",fontSize:13,outline:"none",color:"#3d2c2c",background:"#F8FBFF"}}/>
            </div>
            {/* 검색어 미리보기 */}
            {q.trim()&&region.trim()&&(
              <div style={{background:"rgba(240,249,255,0.8)",borderRadius:10,padding:"7px 12px",marginBottom:10,fontSize:11,color:"#1565C0"}}>
                🔍 검색어: <b>"{q.trim()} {region.trim()}"</b>
              </div>
            )}
            {q.trim()&&(
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>openNaverMap(region.trim()?`${q.trim()} ${region.trim()}`:q.trim())}
                  style={{flex:1,padding:"11px 0",borderRadius:12,border:"none",background:"#03C75A",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                  <span>🗺️</span> 지도 확인
                </button>
                <button onClick={registerHospital}
                  style={{flex:1,padding:"11px 0",borderRadius:12,border:"2px solid #1565C0",background:"#E3F2FD",color:"#1565C0",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                  <span>✅</span> 등록
                </button>
              </div>
            )}
            {showSearch&&state.hospital&&(
              <button onClick={()=>setShowSearch(false)}
                style={{width:"100%",marginTop:8,padding:"9px",borderRadius:11,border:"none",background:"#f5f5f5",color:"#aaa",fontSize:12,cursor:"pointer"}}>
                취소
              </button>
            )}
          </div>
        )}
      </div>
      {/* 병원 진료 일정 섹션 */}
      <AppointmentSection state={state} onUpdate={onUpdate} isUnlocked={state.isUnlocked}/>

      {/* 금지·주의사항 섹션 */}
      <div className="glass-card" style={{borderRadius:22,padding:"1.3rem",marginBottom:13}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <div style={{fontSize:22}}>⚠️</div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#C62828"}}>임산부 금지·주의사항</div>
            <div style={{fontSize:11,color:"#aaa"}}>출처: 아이사랑 포털·서울시민 건강포털·하이닥</div>
          </div>
        </div>
        {CAUTION_LIST.map(sec=>(
          <CautionSection key={sec.cat} sec={sec}/>
        ))}
      </div>

      <div className="glass-card" style={{borderRadius:22,padding:"1.3rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
          <div style={{fontSize:15,fontWeight:700,color:"#3d2c2c"}}>✅ 오늘의 체크리스트</div>
          <div style={{fontSize:12,color:"#f06292",fontWeight:700}}>{done}/{CHECKLIST.length}</div>
        </div>
        <div style={{fontSize:11,color:"#aaa",marginBottom:11}}>매일 자정에 초기화돼요</div>
        <div style={{background:"rgba(235,220,228,0.3)",borderRadius:8,height:8,overflow:"hidden",marginBottom:13}}>
          <div style={{width:`${(done/CHECKLIST.length)*100}%`,height:"100%",background:"linear-gradient(90deg,#fce4ec,#f06292)",borderRadius:8,transition:"width .5s"}}/>
        </div>
        {CHECKLIST.map(item=>(
          <button key={item.id} onClick={()=>toggle(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 11px",borderRadius:14,border:"2px solid",borderColor:checked[item.id]?"#f06292":"#eee",background:checked[item.id]?"rgba(255,228,238,0.85)":"rgba(255,255,255,0.65)",marginBottom:7,cursor:"pointer",textAlign:"left",transition:"all .15s"}}>
            <div style={{width:27,height:27,borderRadius:8,background:checked[item.id]?"#f06292":"#eee",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0,transition:"background .15s"}}>{checked[item.id]?"✓":item.emoji}</div>
            <div>
              <div style={{fontSize:13,fontWeight:checked[item.id]?700:400,color:checked[item.id]?"#e91e63":"#3d2c2c",textDecoration:checked[item.id]?"line-through":"none"}}>{item.label}</div>
              <div style={{fontSize:10,color:"#ccc"}}>{item.cat}</div>
            </div>
          </button>
        ))}
        {done===CHECKLIST.length&&<div style={{textAlign:"center",padding:".8rem",fontSize:14,color:"#f06292",fontWeight:700}}>🎉 오늘 모두 완료했어요!</div>}
      </div>
    </div>
  );
}

// ── 사진 탭 ───────────────────────────────────────────────────
function PhotoTab({state, onUpdate}) {
  const isUnlocked = state.isUnlocked;
  const photos = state.photos || [];

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newPhoto = {
          id: Date.now() + Math.random(),
          dataUrl: ev.target.result,
          label: "",
          week: state.week,
          date: new Date().toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric"}),
        };
        onUpdate({ photos: [...(state.photos||[]), newPhoto] });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const deletePhoto = (id) => {
    if(window.confirm("이 사진을 삭제할까요?")) {
      onUpdate({ photos: photos.filter(p=>p.id!==id) });
    }
  };

  const updateLabel = (id, label) => {
    onUpdate({ photos: photos.map(p=>p.id===id?{...p,label}:p) });
  };

  const g = state.gender||"unknown";

  return (
    <div style={{paddingBottom:"2rem"}}>
      {/* 헤더 */}
      <div style={{
        background:"linear-gradient(135deg,rgba(243,232,255,0.9),rgba(225,210,255,0.8))",
        borderRadius:22,padding:"1.3rem",marginBottom:13,
        border:"1px solid rgba(200,180,255,0.4)",
        display:"flex",alignItems:"center",gap:12
      }}>
        <BabyReading size={75} gender={g}/>
        <div>
          <div style={{fontSize:16,fontWeight:700,color:"#6A1B9A",marginBottom:2}}>아기 사진 앨범 📸</div>
          <div style={{fontSize:11,color:"#9C27B0",lineHeight:1.6}}>
            초음파 사진·배 사진을<br/>가족들과 함께 봐요 💕
          </div>
        </div>
      </div>

      {/* 업로드 버튼 (엄마만) */}
      {isUnlocked && (
        <label style={{
          display:"flex",alignItems:"center",justifyContent:"center",gap:8,
          width:"100%",padding:"13px",borderRadius:16,
          background:"rgba(243,232,255,0.7)",
          border:"2px dashed rgba(156,39,176,0.35)",
          cursor:"pointer",marginBottom:14,
          fontSize:14,fontWeight:700,color:"#7B1FA2",
        }}>
          <span style={{fontSize:20}}>📷</span> 사진 추가하기
          <input type="file" accept="image/*" multiple onChange={handleUpload} style={{display:"none"}}/>
        </label>
      )}

      {!isUnlocked && (
        <div style={{
          background:"rgba(243,232,255,0.5)",borderRadius:14,padding:"10px 14px",
          marginBottom:14,fontSize:12,color:"#9C27B0",textAlign:"center",
          border:"1px solid rgba(200,180,255,0.4)"
        }}>
          🔒 사진 추가·삭제는 엄마만 가능해요 (편집 탭에서 PIN 입력)
        </div>
      )}

      {/* 사진 없을 때 */}
      {photos.length === 0 && (
        <div style={{textAlign:"center",padding:"3rem 1rem"}}>
          <div style={{fontSize:60,marginBottom:12}}>🩻</div>
          <div style={{fontSize:15,color:"#C8A8E9",fontWeight:700,marginBottom:6}}>아직 사진이 없어요</div>
          <div style={{fontSize:12,color:"#ccc",lineHeight:1.7}}>
            초음파 사진, 배 사진 등<br/>소중한 순간들을 올려주세요 💕
          </div>
        </div>
      )}

      {/* 사진 그리드 */}
      {photos.length > 0 && (
        <div>
          <div style={{fontSize:13,fontWeight:700,color:"#7B1FA2",marginBottom:10}}>
            📷 총 {photos.length}장
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[...photos].reverse().map(photo=>(
              <div key={photo.id} className="glass-card" style={{borderRadius:18,overflow:"hidden"}}>
                {/* 사진 */}
                <div style={{position:"relative"}}>
                  <img
                    src={photo.dataUrl}
                    alt={photo.label||"아기 사진"}
                    style={{width:"100%",aspectRatio:"1",objectFit:"cover",display:"block"}}
                  />
                  {/* 주수 뱃지 */}
                  <div style={{
                    position:"absolute",top:8,left:8,
                    background:"rgba(106,27,154,0.75)",color:"#fff",
                    borderRadius:10,padding:"2px 8px",fontSize:10,fontWeight:700,
                    backdropFilter:"blur(4px)"
                  }}>
                    {photo.week}주차
                  </div>
                  {/* 삭제 버튼 (엄마만) */}
                  {isUnlocked && (
                    <button onClick={()=>deletePhoto(photo.id)} style={{
                      position:"absolute",top:6,right:6,
                      width:26,height:26,borderRadius:"50%",
                      background:"rgba(0,0,0,0.45)",border:"none",
                      color:"#fff",fontSize:12,cursor:"pointer",
                      display:"flex",alignItems:"center",justifyContent:"center"
                    }}>✕</button>
                  )}
                </div>
                {/* 정보 */}
                <div style={{padding:"8px 10px"}}>
                  <div style={{fontSize:10,color:"#aaa",marginBottom:4}}>{photo.date}</div>
                  {isUnlocked ? (
                    <input
                      value={photo.label||""}
                      onChange={e=>updateLabel(photo.id,e.target.value)}
                      placeholder="메모 추가..."
                      style={{
                        width:"100%",border:"none",borderBottom:"1.5px solid rgba(180,140,220,0.4)",
                        background:"transparent",fontSize:12,color:"#6A1B9A",
                        outline:"none",padding:"2px 0",fontFamily:"inherit"
                      }}
                    />
                  ) : (
                    <div style={{fontSize:12,color:"#7B1FA2",fontWeight:photo.label?700:400,minHeight:16}}>
                      {photo.label || <span style={{color:"#ddd"}}>메모 없음</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── 설정 탭 ───────────────────────────────────────────────────
function SettingsTab({state,onUpdate,onLock}) {
  const [form,setForm]=useState({...state});
  const toggle=id=>setForm(p=>({...p,conditions:p.conditions?.includes(id)?p.conditions.filter(x=>x!==id):[...(p.conditions||[]),id]}));
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    await onUpdate(form);
    setSaving(false);
    alert("저장됐어요 💕 가족들에게도 바로 반영돼요!");
  };
  return (
    <div style={{paddingBottom:"2rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <BabyWriting size={50} gender={form.gender||"unknown"}/>
          <div style={{fontSize:16,fontWeight:700,color:"#3d2c2c"}}>엄마 전용 편집</div>
        </div>
        <button onClick={onLock} style={{background:"#fce4ec",border:"none",borderRadius:11,padding:"6px 14px",fontSize:12,color:"#e91e63",cursor:"pointer",fontWeight:700}}>잠금</button>
      </div>
      <div className="glass-card" style={{borderRadius:20,padding:"1.2rem",marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,color:"#f06292",marginBottom:11}}>📋 기본 정보</div>
        {[{label:"엄마 이름",key:"momName",type:"text",ph:"예: 김지은"},{label:"아기 태명",key:"babyName",type:"text",ph:"예: 콩이"},{label:"현재 주수 (출산예정일 입력 시 자동)",key:"week",type:"number",ph:"16"},{label:"출산 예정일",key:"dueDate",type:"date",ph:""}].map(f=>(
          <div key={f.key} style={{marginBottom:11}}>
            <div style={{fontSize:11,color:"#999",marginBottom:4}}>{f.label}</div>
            <input type={f.type} value={form[f.key]||""} placeholder={f.ph}
              onChange={e=>{
                const val = f.type==="number"?Number(e.target.value):e.target.value;
                // 출산예정일 입력 시 주수 자동 계산
                if(f.key==="dueDate" && val) {
                  const dueDate = new Date(val);
                  const today = new Date();
                  const diffMs = dueDate - today;
                  const weeksLeft = Math.round(diffMs / (7*24*60*60*1000));
                  const currentWeek = Math.max(1, Math.min(40, 40 - weeksLeft));
                  setForm(p=>({...p, dueDate:val, week:currentWeek}));
                } else {
                  setForm(p=>({...p,[f.key]:val}));
                }
              }}
              style={{width:"100%",padding:"11px 13px",borderRadius:11,border:"1.5px solid #f8bbd0",fontSize:13,outline:"none",color:"#3d2c2c"}}/>
            {/* 출산예정일 입력 시 자동계산 안내 */}
            {f.key==="dueDate" && form.dueDate && (
              <div style={{fontSize:11,color:"#f06292",marginTop:4}}>
                📅 현재 주수 자동계산: <b>{form.week}주차</b>
              </div>
            )}
          </div>
        ))}
        {/* 성별 선택 - 미리보기 포함 */}
        <div style={{fontSize:11,color:"#999",marginBottom:8}}>아기 성별</div>
        <div style={{display:"flex",gap:7}}>
          {[{v:"unknown",l:"미확인",e:"❓"},{v:"boy",l:"아들",e:""},{v:"girl",l:"딸",e:""}].map(g=>(
            <button key={g.v} onClick={()=>setForm(p=>({...p,gender:g.v}))} style={{flex:1,padding:"10px 0",borderRadius:14,border:"2px solid",borderColor:form.gender===g.v?(g.v==="boy"?"#90CAF9":g.v==="girl"?"#F48FB1":"#f06292"):"#f0f0f0",background:form.gender===g.v?(g.v==="boy"?"#E3F2FD":g.v==="girl"?"#FCE4EC":"#fce4ec"):"#fff",fontSize:11,cursor:"pointer",fontWeight:700,color:"#3d2c2c",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
              {g.v==="unknown"?<span style={{fontSize:18}}>❓</span>:<BabyNeutral size={44} gender={g.v}/>}
              <span>{g.l}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="glass-card-yellow" style={{borderRadius:20,padding:"1.2rem",marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,color:"#f9a825",marginBottom:7}}>💌 가족에게 한마디</div>
        <textarea value={form.memo||""} onChange={e=>setForm(p=>({...p,memo:e.target.value}))} placeholder="오늘 하고 싶은 말 (가족 홈화면에 표시돼요)"
          style={{width:"100%",padding:"11px 13px",borderRadius:11,border:"1.5px solid #fff176",fontSize:12,outline:"none",resize:"vertical",minHeight:68,color:"#555"}}/>
      </div>
      <div className="glass-card" style={{borderRadius:20,padding:"1.2rem",marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,color:"#f06292",marginBottom:3}}>🩺 오늘 증상 선택</div>
        <div style={{fontSize:11,color:"#bbb",marginBottom:14}}>해당 항목 모두 선택해 주세요</div>
        {SYMPTOM_GROUPS.map(g=>(
          <div key={g.group} style={{marginBottom:15}}>
            <div style={{fontSize:12,fontWeight:700,color:g.color,marginBottom:7,borderLeft:`3px solid ${g.color}`,paddingLeft:7}}>{g.group}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {g.items.map(s=>{const a=form.conditions?.includes(s.id);return(
                <button key={s.id} onClick={()=>toggle(s.id)} style={{padding:"9px 10px",borderRadius:12,border:"2px solid",textAlign:"left",borderColor:a?g.color:"#eee",background:a?g.bg:"rgba(255,255,255,0.55)",fontSize:11,cursor:"pointer",color:"#3d2c2c",fontWeight:a?700:400,display:"flex",alignItems:"center",gap:5,transition:"all .15s"}}>
                  <span style={{fontSize:14,flexShrink:0}}>{s.emoji}</span><span style={{lineHeight:1.3}}>{s.label}</span>
                  {s.sev>=4&&<span style={{marginLeft:"auto",fontSize:9,color:"#E53935"}}>❗</span>}
                </button>);
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="glass-card" style={{borderRadius:16,padding:"1rem",marginBottom:13}}>
        <div style={{fontSize:11,color:"#888",marginBottom:5}}>🔑 비밀번호 변경 (숫자 4자리)</div>
        <input type="password" value={form.pin||""} onChange={e=>setForm(p=>({...p,pin:e.target.value}))} maxLength={4} placeholder="새 비밀번호 4자리 입력"
          style={{width:"100%",padding:"11px",borderRadius:11,border:"1.5px solid #ddd",fontSize:16,outline:"none",letterSpacing:8,textAlign:"center"}}/>
      </div>
      <button onClick={save} disabled={saving} style={{width:"100%",padding:"15px",borderRadius:17,border:"none",background:saving?"#f8bbd0":"linear-gradient(135deg,#f48fb1,#f06292)",color:"#fff",fontSize:15,fontWeight:700,cursor:saving?"default":"pointer",boxShadow:"0 4px 16px rgba(240,98,146,.38)",transition:"background .2s"}}>
        {saving ? "⏳ 저장 중..." : "💾 저장하기 (가족에게 바로 공유)"}
      </button>
    </div>
  );
}

// ── 메인 ──────────────────────────────────────────────────────
export default function App() {
  const [state,setState]=useState(DEFAULT);
  const [tab,setTab]=useState("home");
  const [showPin,setShowPin]=useState(false);
  const [activeFamily,setActiveFamily]=useState(null); // null = 내 가족, string = 팔로잉 코드
  const [followingData,setFollowingData]=useState({}); // {코드: 데이터}
  const [showAddFamily,setShowAddFamily]=useState(false); // + 탭 모달
  // ── 앱 시작 시 코드 복구 (URL → localStorage → 없으면 입력) ──
  useEffect(()=>{
    // 1순위: URL 파라미터에서 코드 읽기
    const urlParams = new URLSearchParams(window.location.search);
    const urlCode = urlParams.get('code');
    // 2순위: localStorage에서 코드 읽기
    const savedCode = localStorage.getItem('pgApp_familyCode');
    const code = urlCode || savedCode;
    if(code && !state.familyCode) {
      // localStorage에도 저장 (백업)
      localStorage.setItem('pgApp_familyCode', code);
      setState(p=>({...p, familyCode:code}));
    }
  }, []);

  // ── Firebase 실시간 구독 (familyCode 기반) ───────────────────
  useEffect(()=>{
    if(!state.familyCode) return; // 코드 없으면 구독 안 함
    let unsubState = null;
    let unsubPhotos = null;
    const subscribe = () => {
      if(window.firebaseDb && window.firebaseRef && window.firebaseOnValue) {
        const base = `families/${state.familyCode}`;
        const stateRef = window.firebaseRef(window.firebaseDb, `${base}/pgApp_state`);
        unsubState = window.firebaseOnValue(stateRef, (snapshot) => {
          const value = snapshot.val();
          if(value) {
            try {
              const parsed = JSON.parse(value);
              setState(p=>({...p,...parsed,isUnlocked:p.isUnlocked,familyCode:p.familyCode}));
            } catch(e) {}
          }
        });
        const photosRef = window.firebaseRef(window.firebaseDb, `${base}/pgApp_photos`);
        unsubPhotos = window.firebaseOnValue(photosRef, (snapshot) => {
          const value = snapshot.val();
          if(value) {
            try {
              const photos = JSON.parse(value);
              setState(p=>({...p, photos}));
            } catch(e) {}
          }
        });
      } else {
        setTimeout(subscribe, 500);
      }
    };
    subscribe();
    return () => {
      if(unsubState) unsubState();
      if(unsubPhotos) unsubPhotos();
    };
  }, [state.familyCode]);

  // ── 팔로잉 가족들 실시간 구독 ────────────────────────────
  useEffect(()=>{
    if(!state.followingFamilies?.length) return;
    const unsubs = [];
    state.followingFamilies.forEach(fc=>{
      if(!window.firebaseDb || !window.firebaseRef || !window.firebaseOnValue) return;
      const r = window.firebaseRef(window.firebaseDb, `families/${fc}/pgApp_state`);
      const unsub = window.firebaseOnValue(r, (snap)=>{
        const val = snap.val();
        if(val) {
          try {
            const parsed = JSON.parse(val);
            setFollowingData(p=>({...p, [fc]: parsed}));
          } catch(e) {}
        }
      });
      unsubs.push(unsub);
    });
    return () => unsubs.forEach(u=>u&&u());
  }, [state.followingFamilies]);
  const save = async (u) => {
    const nx = {...state, ...u};
    setState(nx);
    if(!nx.familyCode) return;
    // localStorage + URL 항상 최신 코드 유지
    localStorage.setItem('pgApp_familyCode', nx.familyCode);
    const url = new URL(window.location.href);
    url.searchParams.set('code', nx.familyCode);
    window.history.replaceState({}, '', url.toString());
    const {isUnlocked, photos, ...s} = nx;
    const base = `families/${nx.familyCode}`;
    try {
      if(window.firebaseDb && window.firebaseRef) {
        const { set: fbSet } = await import('firebase/database');
        const stateRef = window.firebaseRef(window.firebaseDb, `${base}/pgApp_state`);
        await fbSet(stateRef, JSON.stringify(s));
      }
    } catch(e) { console.warn("저장 실패", e); }
    try {
      if(photos !== undefined && window.firebaseDb && window.firebaseRef) {
        const { set: fbSet } = await import('firebase/database');
        const photosRef = window.firebaseRef(window.firebaseDb, `${base}/pgApp_photos`);
        await fbSet(photosRef, JSON.stringify(photos));
      }
    } catch(e) { console.warn("사진 저장 실패"); }
  };
  const TABS=[{id:"home",label:"홈",emoji:"🏠"},{id:"week",label:"주수",emoji:"📅"},{id:"food",label:"음식",emoji:"🥗"},{id:"care",label:"케어",emoji:"🏥"},{id:"photo",label:"사진",emoji:"📸"},{id:"settings",label:"편집",emoji:"✏️"}];
  const g=state.gender||"unknown";
  // URL 파라미터로 설명서 진입
  const [showGuide] = useState(()=>new URLSearchParams(window.location.search).get('guide')==='1');
  if(showGuide) return <GuideScreen/>;

  // 가족 코드 없으면 진입 화면 표시
  if(!state.familyCode) {
    return <FamilyEntry onEnter={(code)=>{
      // localStorage에 저장 (아이폰 뒤로가기 대비)
      localStorage.setItem('pgApp_familyCode', code);
      // URL에 코드 추가 (가장 안전한 방법)
      const url = new URL(window.location.href);
      url.searchParams.set('code', code);
      window.history.replaceState({}, '', url.toString());
      setState(p=>({...p,familyCode:code}));
    }}/>;
  }

  return (
    <div className="app-bg" style={{fontFamily:"'Jua','Noto Sans KR',sans-serif",maxWidth:430,margin:"0 auto",minHeight:"100vh",display:"flex",flexDirection:"column",position:"relative"}}>
      <div className="deco-circle-1"/>
      <div className="deco-circle-2"/>
      <div className="deco-circle-3"/>
      <style>{fontStyle}</style>
      {/* 상단 정보바 - 코드 + 실시간 */}
      <div style={{background:"rgba(240,249,255,0.9)",borderBottom:"1px solid rgba(180,220,255,0.4)",padding:"5px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#1565C0"}}>
          <span style={{fontSize:11}}>🔄</span>
          <span>실시간 공유 중</span>
        </div>
        {/* 내 가족 코드 표시 + 복사 */}
        <button onClick={()=>{
          navigator.clipboard.writeText(state.familyCode).then(()=>alert(`코드가 복사됐어요! 💕

${state.familyCode}

카톡에 붙여넣기 하세요`)).catch(()=>alert(`내 가족 코드: ${state.familyCode}`));
        }} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(255,255,255,0.7)",border:"1px solid rgba(240,98,146,0.25)",borderRadius:10,padding:"3px 9px",cursor:"pointer",fontSize:11,color:"#e91e63",fontWeight:700}}>
          <span style={{fontSize:10}}>🔑</span>
          <span>{state.familyCode}</span>
          <span style={{fontSize:10,color:"#f48fb1"}}>📋</span>
        </button>
      </div>
      <div style={{background:"rgba(255,248,252,0.88)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:"1px solid rgba(240,215,228,0.45)",padding:"0.8rem 1.1rem",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <span style={{fontSize:20}}>🌸</span>
          <span style={{fontSize:16,fontWeight:700,color:"#880e4f"}}>Baby Journey</span>
        </div>
        <div style={{display:"flex",gap:7,alignItems:"center"}}>
          {g==="boy"&&<div style={{background:"#E3F2FD",borderRadius:12,padding:"2px 8px",fontSize:11,color:"#1565C0",fontWeight:700}}>👦 아들</div>}
          {g==="girl"&&<div style={{background:"#FCE4EC",borderRadius:12,padding:"2px 8px",fontSize:11,color:"#C2185B",fontWeight:700}}>👧 딸</div>}
          <div style={{background:"rgba(255,255,255,.65)",borderRadius:18,padding:"3px 11px",fontSize:12,color:"#ad1457",fontWeight:700}}>{state.week}주차</div>
          {/* 가족 코드 공유 버튼 */}
          <button onClick={()=>{
            // 코드 포함된 URL 생성 (링크만 눌러도 바로 입장)
            const shareUrl = `${window.location.origin}${window.location.pathname}?code=${state.familyCode}`;
            const msg = `🌸 Baby Journey 임신 앱

아래 링크를 누르면 바로 입장돼요!
${shareUrl}

(가족 코드: ${state.familyCode})`;
            if(navigator.share) navigator.share({title:'Baby Journey 🌸', text:msg, url:shareUrl});
            else { navigator.clipboard.writeText(msg); alert('링크가 복사됐어요! 카톡에 붙여넣기 하세요 💕\n\n링크만 누르면 바로 입장돼요!'); }
          }} style={{background:"rgba(255,255,255,.65)",border:"none",borderRadius:18,padding:"3px 11px",fontSize:12,color:"#ad1457",fontWeight:700,cursor:"pointer"}}>
            공유 📤
          </button>
          <button onClick={()=>setShowAddFamily(true)} style={{background:"rgba(255,255,255,.65)",border:"none",borderRadius:18,padding:"3px 10px",fontSize:14,color:"#f06292",fontWeight:700,cursor:"pointer"}}>
            ＋
          </button>
        </div>
      </div>
      {/* 가족 탭바 - 팔로잉 가족 있을 때만 표시 */}
      {(state.followingFamilies?.length > 0) && (
        <FamilyTabBar
          state={state}
          activeFamily={activeFamily}
          setActiveFamily={(code)=>{ setActiveFamily(code); setTab("home"); }}
          followingData={followingData}
          onAdd={()=>setShowAddFamily(true)}
        />
      )}

      <div style={{flex:1,padding:".9rem .9rem 5.5rem",overflowY:"auto"}}>
        {/* 팔로잉 가족 보기 모드 */}
        {activeFamily && followingData[activeFamily] ? (
          <FollowingView
            data={followingData[activeFamily]}
            code={activeFamily}
            onBack={()=>setActiveFamily(null)}
          />
        ) : (
          <>
        {tab==="home"&&<HomeTab state={state}/>}
        {tab==="week"&&<WeekTab state={state}/>}
        {tab==="food"&&<FoodTab state={state} onUpdate={save}/>}
        {tab==="care"&&<CareTab state={state} onUpdate={save}/>}
        {tab==="photo"&&<PhotoTab state={state} onUpdate={save}/>}
        {tab==="settings"&&state.isUnlocked&&<SettingsTab state={state} onUpdate={save} onLock={()=>{setState(p=>({...p,isUnlocked:false}));setTab("home");}}/>}
        {tab==="settings"&&!state.isUnlocked&&<div style={{textAlign:"center",paddingTop:"5rem"}}><BabySleeping size={100} gender={g}/><div style={{fontSize:15,color:"#bbb",marginTop:8}}>엄마 전용 편집 모드예요</div></div>}
          </>
        )}
      </div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"rgba(255,250,253,0.94)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:"1px solid rgba(235,210,222,0.4)",display:"flex",padding:".45rem 0 .8rem",zIndex:100}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>t.id==="settings"?(state.isUnlocked?setTab("settings"):setShowPin(true)):setTab(t.id)}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",padding:"3px 0"}}>
            <span style={{fontSize:19,transform:tab===t.id?"scale(1.18)":"scale(1)",transition:"transform .2s"}}>{t.emoji}</span>
            <span style={{fontSize:10,fontWeight:700,color:tab===t.id?"#f06292":"#bbb"}}>{t.label}</span>
            {tab===t.id&&<div style={{width:16,height:2.5,borderRadius:2,background:"#f06292"}}/>}
          </button>
        ))}
      </div>
      {showPin&&<PinModal onSuccess={()=>{setShowPin(false);setState(p=>({...p,isUnlocked:true}));setTab("settings");}} onClose={()=>setShowPin(false)} gender={g}/>}
      {showAddFamily&&<AddFamilyModal
        existingCodes={state.followingFamilies||[]}
        onAdd={(code)=>{
          const updated = [...(state.followingFamilies||[]), code];
          save({followingFamilies: updated});
          setShowAddFamily(false);
          setActiveFamily(code);
          setTab("home");
        }}
        onClose={()=>setShowAddFamily(false)}
      />}
    </div>
  );
}
