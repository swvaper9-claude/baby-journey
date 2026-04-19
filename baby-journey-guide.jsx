// Baby Journey 완벽 사용 설명서 - Artifact 버전
import { useState } from "react";

const S = {
  header: { background:"linear-gradient(135deg,#fce4ec,#f8bbd0,#f48fb1)", padding:"1.8rem 1.2rem 1.5rem", textAlign:"center", position:"relative", overflow:"hidden" },
  h1: { fontFamily:"'Jua',sans-serif", fontSize:"1.7rem", color:"#880e4f", marginBottom:4 },
  sub: { fontSize:12, color:"#ad1457", marginBottom:12 },
  url: { display:"inline-block", background:"rgba(255,255,255,.75)", borderRadius:20, padding:"6px 16px", fontSize:12, color:"#880e4f", fontWeight:700, border:"1px solid rgba(240,98,146,.3)" },
  mainTabs: { display:"flex", background:"white", borderBottom:"3px solid #f8bbd0", position:"sticky", top:0, zIndex:200, boxShadow:"0 2px 10px rgba(240,98,146,.1)" },
  osTabs: { display:"flex", background:"#fff5f8", borderBottom:"2px solid #fce4ec", position:"sticky", top:49, zIndex:199 },
  section: { margin:"1rem 0.8rem", background:"white", borderRadius:20, boxShadow:"0 2px 14px rgba(240,98,146,.08)", border:"1px solid #fce4ec", overflow:"hidden" },
  sHead: { background:"linear-gradient(135deg,#fce4ec,#fde8f2)", padding:"11px 16px", display:"flex", alignItems:"center", gap:9 },
  sNum: { width:28, height:28, borderRadius:"50%", background:"#e91e63", color:"white", fontFamily:"'Jua',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 },
  sTitle: { fontFamily:"'Jua',sans-serif", fontSize:15, color:"#880e4f" },
  sBody: { padding:"14px 16px" },
  desc: { fontSize:13, color:"#555", lineHeight:1.7, marginBottom:10 },
  tip: { background:"#fff3e0", borderRadius:11, padding:"10px 13px", margin:"9px 0", borderLeft:"4px solid #FF9800", fontSize:12, color:"#E65100", lineHeight:1.6 },
  ok:  { background:"#E8F5E9", borderRadius:11, padding:"10px 13px", margin:"9px 0", borderLeft:"4px solid #2E7D32", fontSize:12, color:"#1B5E20", lineHeight:1.6 },
  info:{ background:"#E3F2FD", borderRadius:11, padding:"10px 13px", margin:"9px 0", borderLeft:"4px solid #1565C0", fontSize:12, color:"#0D47A1", lineHeight:1.6 },
  stepItem: { display:"flex", gap:12, alignItems:"flex-start", padding:"10px 0", borderBottom:"1px solid #fce4ec" },
  stepIcon: { width:36, height:36, borderRadius:10, background:"#fce4ec", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 },
  badgeMom: { display:"inline-block", background:"#fce4ec", color:"#e91e63", borderRadius:20, padding:"2px 11px", fontSize:11, fontWeight:700, marginBottom:9 },
  badgeFam: { display:"inline-block", background:"#E3F2FD", color:"#1565C0", borderRadius:20, padding:"2px 11px", fontSize:11, fontWeight:700, marginBottom:9 },
  tabGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 },
  tabItem: { background:"#fce4ec", borderRadius:13, padding:"10px", textAlign:"center" },
  phoneWrap: { display:"flex", justifyContent:"center", margin:"12px 0" },
  phone: { width:180, background:"#1a1a2e", borderRadius:26, padding:"10px 6px", boxShadow:"0 8px 28px rgba(0,0,0,.25)", border:"4px solid #333" },
  screen: { background:"linear-gradient(160deg,#fff5f8,#fef6ff,#f5f8ff)", borderRadius:16, overflow:"hidden", minHeight:300, position:"relative" },
};

const Phone = ({ children }) => (
  <div style={S.phoneWrap}>
    <div style={S.phone}>
      <div style={{ width:55, height:10, background:"#1a1a2e", borderRadius:"0 0 8px 8px", margin:"0 auto 5px" }}/>
      <div style={S.screen}>{children}</div>
    </div>
  </div>
);

const Sec = ({ num, title, children }) => (
  <div style={S.section}>
    <div style={S.sHead}><div style={S.sNum}>{num}</div><div style={S.sTitle}>{title}</div></div>
    <div style={S.sBody}>{children}</div>
  </div>
);

const Step = ({ icon, title, desc }) => (
  <div style={{ ...S.stepItem }}>
    <div style={S.stepIcon}>{icon}</div>
    <div><div style={{ fontWeight:700, fontSize:13, marginBottom:3 }}>{title}</div><div style={{ fontSize:12, color:"#777", lineHeight:1.5 }}>{desc}</div></div>
  </div>
);

// 폰 화면 공통 컴포넌트들
const PsTopbar = () => (
  <div style={{ background:"rgba(240,249,255,.9)", padding:"4px 8px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid rgba(180,220,255,.4)" }}>
    <span style={{ fontSize:6, color:"#1565C0" }}>🔄 실시간 공유 중</span>
    <span style={{ fontSize:6, color:"#e91e63", background:"rgba(255,255,255,.7)", borderRadius:5, padding:"1px 4px", border:"1px solid rgba(240,98,146,.3)" }}>🔑 BABY-K7X2 📋</span>
  </div>
);
const PsHeader = ({ week="16주차" }) => (
  <div style={{ background:"rgba(255,248,252,.9)", padding:"5px 8px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid rgba(240,215,228,.4)" }}>
    <span style={{ fontFamily:"'Jua',sans-serif", fontSize:8, color:"#880e4f" }}>🌸 Baby Journey</span>
    <div style={{ display:"flex", gap:3 }}>
      <span style={{ background:"rgba(255,255,255,.65)", borderRadius:8, padding:"1px 4px", fontSize:6, color:"#ad1457", fontFamily:"'Jua',sans-serif" }}>{week}</span>
      <span style={{ background:"rgba(255,255,255,.65)", borderRadius:8, padding:"1px 4px", fontSize:6, color:"#ad1457" }}>공유 📤</span>
      <span style={{ background:"rgba(255,255,255,.65)", borderRadius:8, padding:"1px 4px", fontSize:7, color:"#f06292" }}>＋</span>
    </div>
  </div>
);
const PsTabbar = ({ active="홈" }) => {
  const tabs = [["🏠","홈"],["📅","주수"],["🥗","음식"],["🏥","케어"],["✏️","편집"]];
  return (
    <div style={{ display:"flex", background:"rgba(255,250,253,.95)", borderTop:"1px solid rgba(235,210,222,.4)", padding:"3px 0 5px" }}>
      {tabs.map(([e,l]) => (
        <div key={l} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:1 }}>
          <span style={{ fontSize:11 }}>{e}</span>
          <span style={{ fontSize:5, color: l===active ? "#f06292" : "#bbb", fontFamily:"'Jua',sans-serif" }}>{l}</span>
          {l===active && <div style={{ width:8, height:2, borderRadius:1, background:"#f06292" }}/>}
        </div>
      ))}
    </div>
  );
};

// ── 비주얼 iOS ──────────────────────────────────────────────
const VisualIOS = () => (
  <div style={{ paddingBottom:"3rem" }}>
    <Sec num="1" title="카톡 링크 열기">
      <div style={S.desc}>카톡에서 받은 링크를 <b>길게 눌러 "Safari로 열기"</b>를 선택하세요.</div>
      <Phone>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px 12px", minHeight:300, background:"linear-gradient(160deg,#fff5f8,#fef6ff)" }}>
          <div style={{ fontSize:32, marginBottom:5 }}>🌸</div>
          <div style={{ fontSize:20, marginBottom:5 }}>👶</div>
          <div style={{ fontFamily:"'Jua',sans-serif", fontSize:11, color:"#880e4f", marginBottom:12 }}>Baby Journey</div>
          <div style={{ width:"100%", padding:"7px", borderRadius:10, background:"linear-gradient(135deg,#f48fb1,#f06292)", fontFamily:"'Jua',sans-serif", fontSize:9, color:"white", textAlign:"center", marginBottom:6 }}>🤰 새 가족 공간 만들기</div>
          <div style={{ width:"100%", padding:"6px", borderRadius:10, border:"1.5px solid rgba(240,98,146,.35)", background:"rgba(255,255,255,.8)", fontFamily:"'Jua',sans-serif", fontSize:9, color:"#e91e63", textAlign:"center" }}>🔑 가족 코드로 참여하기</div>
        </div>
      </Phone>
      <div style={S.tip}>⚠️ <b>Safari</b>로 열어야 저장이 잘 돼요!</div>
    </Sec>

    <Sec num="2" title="홈 화면에 저장 (꼭 하세요!)">
      <div style={S.desc}>Safari 하단 가운데 <b>공유 버튼(□↑)</b> → <b>"홈 화면에 추가"</b> 선택</div>
      <Phone>
        <div style={{ display:"flex", flexDirection:"column", minHeight:300 }}>
          <div style={{ flex:1, background:"linear-gradient(160deg,#fff5f8,#fef6ff)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32 }}>🌸</div>
          <div style={{ background:"rgba(248,248,248,.95)", padding:"6px 8px", display:"flex", justifyContent:"space-around", alignItems:"center", borderTop:"1px solid #ddd" }}>
            <span style={{ fontSize:13, color:"#007AFF" }}>◀</span>
            <span style={{ fontSize:13, color:"#007AFF" }}>▶</span>
            <div style={{ background:"#007AFF", borderRadius:5, padding:"2px 5px", position:"relative" }}>
              <span style={{ fontSize:11, color:"white" }}>□↑</span>
              <div style={{ position:"absolute", top:-20, left:"50%", transform:"translateX(-50%)", background:"#e91e63", color:"white", borderRadius:5, padding:"1px 5px", fontSize:7, whiteSpace:"nowrap", fontFamily:"'Jua',sans-serif" }}>← 이걸!</div>
            </div>
            <span style={{ fontSize:13, color:"#007AFF" }}>📖</span>
            <span style={{ fontSize:13, color:"#007AFF" }}>⋯</span>
          </div>
        </div>
      </Phone>
      <div style={S.tip}>⚠️ <b>홈 화면 저장 필수!</b> 뒤로가기 눌러도 초기화 안 돼요!</div>
    </Sec>

    <Sec num="3" title="엄마 — 새 가족 공간 만들기">
      <div style={S.badgeMom}>👩 엄마(임산부)만 하세요</div>
      <div style={S.desc}>"새 가족 공간 만들기" → 비밀번호 설정 → 코드 자동 생성!</div>
      <Phone>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"14px 10px", background:"linear-gradient(160deg,#fff5f8,#fef6ff)", minHeight:300 }}>
          <div style={{ fontSize:24, marginBottom:5 }}>🔐</div>
          <div style={{ fontFamily:"'Jua',sans-serif", fontSize:11, marginBottom:2 }}>비밀번호 설정</div>
          <div style={{ fontSize:7, color:"#aaa", textAlign:"center", marginBottom:10, lineHeight:1.5 }}>숫자 4자리 · 두 번 입력해요</div>
          <div style={{ background:"rgba(255,240,248,.7)", borderRadius:8, padding:"6px 10px", textAlign:"center", width:"100%", marginBottom:9, border:"1px solid rgba(240,98,146,.2)" }}>
            <div style={{ fontSize:7, color:"#aaa" }}>내 가족 코드 (자동생성)</div>
            <div style={{ fontFamily:"'Jua',sans-serif", fontSize:13, color:"#e91e63", letterSpacing:2 }}>BABY-K7X2</div>
          </div>
          <div style={{ fontSize:8, color:"#888", width:"100%", marginBottom:3 }}>비밀번호</div>
          <div style={{ display:"flex", gap:3, marginBottom:7, width:"100%" }}>
            {[1,2,3,4].map(i => <div key={i} style={{ flex:1, height:9, borderRadius:5, background:"#f06292" }}/>)}
          </div>
          <div style={{ fontSize:8, color:"#888", width:"100%", marginBottom:3 }}>비밀번호 확인</div>
          <div style={{ display:"flex", gap:3, marginBottom:9, width:"100%" }}>
            {[1,2].map(i => <div key={i} style={{ flex:1, height:9, borderRadius:5, background:"#f06292" }}/>)}
            {[3,4].map(i => <div key={i} style={{ flex:1, height:9, borderRadius:5, border:"1.5px solid rgba(240,98,146,.4)", background:"white" }}/>)}
          </div>
          <div style={{ width:"100%", background:"linear-gradient(135deg,#f48fb1,#f06292)", borderRadius:9, padding:"7px", textAlign:"center", fontFamily:"'Jua',sans-serif", fontSize:9, color:"white" }}>✅ 완료! 가족 공간 만들기</div>
        </div>
      </Phone>
      <div style={S.ok}>✅ 비밀번호는 생일 같은 기억하기 쉬운 숫자로!</div>
    </Sec>

    <Sec num="4" title="엄마 — 기본 정보 입력">
      <div style={S.badgeMom}>👩 엄마만</div>
      <div style={S.desc}>✏️ 편집 탭 → 비밀번호 입력 → 출산예정일 입력하면 주수 자동계산!</div>
      <Phone>
        <div>
          <PsTopbar/>
          <div style={{ background:"rgba(255,235,245,.9)", padding:"6px 8px", fontFamily:"'Jua',sans-serif", fontSize:8, color:"#880e4f", borderBottom:"1px solid rgba(255,200,225,.3)" }}>✏️ 엄마 전용 편집</div>
          <div style={{ background:"white", margin:5, borderRadius:10, padding:6, border:"1px solid #fce4ec" }}>
            <div style={{ fontSize:7, fontWeight:700, color:"#f06292", marginBottom:5 }}>📋 기본 정보</div>
            {[["엄마 이름","김지은"],["아기 태명","콩이"]].map(([l,v]) => (
              <div key={l} style={{ marginBottom:4 }}>
                <div style={{ fontSize:6, color:"#999", marginBottom:1 }}>{l}</div>
                <div style={{ background:"white", border:"1.5px solid #f8bbd0", borderRadius:5, padding:"3px 6px", fontSize:7, color:"#3d2c2c" }}>{v}</div>
              </div>
            ))}
            <div style={{ fontSize:6, color:"#f06292", fontWeight:700, marginBottom:1 }}>출산 예정일 ← 여기!</div>
            <div style={{ background:"white", border:"1.5px solid #f06292", borderRadius:5, padding:"3px 6px", fontSize:7, color:"#3d2c2c", marginBottom:2 }}>2025년 10월 15일</div>
            <div style={{ fontSize:6, color:"#f06292" }}>📅 주수 자동계산: <b>16주차</b></div>
          </div>
          <div style={{ margin:5, padding:6, background:"linear-gradient(135deg,#f48fb1,#f06292)", borderRadius:8, textAlign:"center", fontFamily:"'Jua',sans-serif", fontSize:8, color:"white" }}>💾 저장하기 (가족에게 바로 공유)</div>
          <PsTabbar active="편집"/>
        </div>
      </Phone>
      <div style={S.ok}>✅ 출산예정일 → 주수 자동계산! 저장 → 5초 이내 가족 폰 반영!</div>
    </Sec>

    <Sec num="5" title="가족에게 코드 공유">
      <div style={S.desc}>상단 <b>🔑 BABY-XXXX 📋</b> 누르면 코드 복사! 카톡에 붙여넣기!</div>
      <Phone>
        <div>
          <PsTopbar/>
          <PsHeader/>
          <div style={{ background:"rgba(255,240,248,.8)", margin:7, borderRadius:10, padding:9, border:"2px dashed rgba(240,98,146,.4)", textAlign:"center" }}>
            <div style={{ fontSize:7, color:"#aaa", marginBottom:3 }}>📋 눌러서 복사!</div>
            <div style={{ fontFamily:"'Jua',sans-serif", fontSize:14, color:"#e91e63", letterSpacing:3 }}>BABY-K7X2</div>
            <div style={{ fontSize:6, color:"#ccc", marginTop:2 }}>카톡에 붙여넣기 하세요</div>
          </div>
          <div style={{ margin:"0 7px", background:"#E8F5E9", borderRadius:8, padding:6, fontSize:6, color:"#2E7D32", lineHeight:1.5 }}>✅ 가족이 이 코드를 입력하면 실시간 연결!</div>
        </div>
      </Phone>
      <div style={S.info}>💡 <b>공유 📤</b> 버튼으로 링크+코드 한 번에 전송!</div>
    </Sec>

    <Sec num="6" title="가족 — 코드로 참여하기">
      <div style={S.badgeFam}>👨‍👩‍👧 가족 (남편·부모님·형제)</div>
      <div style={S.desc}>링크 클릭하면 자동 입장! 코드만 받았으면 직접 입력.</div>
      <Phone>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"16px 10px", minHeight:300, background:"linear-gradient(160deg,#fff5f8,#fef6ff)" }}>
          <div style={{ fontSize:20, marginBottom:5 }}>👶</div>
          <div style={{ fontFamily:"'Jua',sans-serif", fontSize:11, color:"#880e4f", marginBottom:10 }}>Baby Journey</div>
          <div style={{ width:"100%", padding:"6px", borderRadius:10, border:"1.5px solid #e91e63", background:"rgba(255,200,220,.2)", fontFamily:"'Jua',sans-serif", fontSize:9, color:"#e91e63", textAlign:"center", marginBottom:10, position:"relative" }}>
            🔑 가족 코드로 참여하기
            <div style={{ position:"absolute", top:-18, left:"50%", transform:"translateX(-50%)", background:"#e91e63", color:"white", borderRadius:5, padding:"1px 6px", fontSize:7, whiteSpace:"nowrap", fontFamily:"'Jua',sans-serif" }}>← 이걸!</div>
          </div>
          <div style={{ background:"rgba(255,255,255,.82)", borderRadius:11, padding:"9px 8px", width:"100%", border:"1px solid rgba(255,200,225,.5)" }}>
            <div style={{ fontFamily:"'Jua',sans-serif", fontSize:8, color:"#3d2c2c", marginBottom:4, textAlign:"center" }}>🔑 가족 코드 입력</div>
            <div style={{ width:"100%", padding:"6px", borderRadius:7, border:"2px solid rgba(240,98,146,.3)", fontSize:11, textAlign:"center", letterSpacing:2, color:"#e91e63", fontFamily:"'Jua',sans-serif", background:"rgba(255,248,252,.8)", marginBottom:5 }}>BABY-K7X2</div>
            <div style={{ background:"linear-gradient(135deg,#f48fb1,#f06292)", borderRadius:7, padding:5, textAlign:"center", fontFamily:"'Jua',sans-serif", fontSize:8, color:"white" }}>💕 참여하기</div>
          </div>
        </div>
      </Phone>
      <div style={S.ok}>✅ 한 번 입력하면 다음부터 자동으로 바로 입장!</div>
      <div style={S.tip}>⚠️ 아이폰은 반드시 <b>홈 화면에 저장</b>해두세요!</div>
    </Sec>

    <Sec num="7" title="홈 화면 — 이렇게 보여요">
      <div style={S.desc}>엄마 컨디션·여정·병원 정보 한눈에 확인!</div>
      <Phone>
        <div>
          <PsTopbar/>
          <PsHeader/>
          <div style={{ display:"flex", background:"rgba(255,248,252,.95)", borderBottom:"1px solid rgba(240,190,215,.4)" }}>
            {["💕 내 가족","🌸 지은이네","＋"].map((t,i) => (
              <div key={t} style={{ padding:"4px 6px", fontSize:7, fontFamily:"'Jua',sans-serif", color:i===0?"#e91e63":"#bbb", borderBottom:`2px solid ${i===0?"#e91e63":"transparent"}` }}>{t}</div>
            ))}
          </div>
          <div style={{ background:"linear-gradient(135deg,#fff0f5,#fde8f2)", padding:8, margin:5, borderRadius:10 }}>
            <div style={{ fontFamily:"'Jua',sans-serif", fontSize:9, color:"#880e4f", marginBottom:2 }}>김지은의 소중한 여정 🤰</div>
            <div style={{ display:"inline-block", background:"rgba(255,255,255,.6)", borderRadius:6, padding:"1px 5px", fontSize:7, color:"#880e4f", fontFamily:"'Jua',sans-serif" }}>출산까지 D-168</div>
          </div>
          <div style={{ background:"#fff3f3", margin:"0 5px 4px", padding:"5px 6px", borderRadius:8, border:"1px solid rgba(229,57,53,.2)" }}>
            <div style={{ fontSize:6, color:"#999", marginBottom:1 }}>오늘 엄마 컨디션</div>
            <div style={{ fontFamily:"'Jua',sans-serif", fontSize:9, color:"#E53935" }}>😢 많이 힘듦</div>
            <div style={{ display:"flex", gap:2, marginTop:2 }}>
              {[1,2,3,4].map(i=><div key={i} style={{flex:1,height:4,borderRadius:2,background:"#E53935"}}/>)}
              <div style={{flex:1,height:4,borderRadius:2,background:"#eee"}}/>
            </div>
            <div style={{ fontSize:6, color:"#555", marginTop:2 }}>💬 많이 힘든 날이에요. 전화해주세요 📞</div>
          </div>
          <PsTabbar active="홈"/>
        </div>
      </Phone>
      <div style={S.info}>💡 상단 탭에서 친구 가족도 탭 클릭 한 번으로 전환!</div>
    </Sec>

    <Sec num="8" title="병원 등록하기">
      <div style={S.badgeMom}>👩 엄마만</div>
      <div style={S.desc}>🏥 케어 탭 → 병원명 + 지역 입력 → 네이버 지도에서 정확히 한 곳!</div>
      <Phone>
        <div>
          <PsTopbar/>
          <div style={{ padding:5 }}>
            <div style={{ background:"white", borderRadius:10, padding:7, border:"1px solid #BBDEFB" }}>
              <div style={{ fontSize:7, fontWeight:700, color:"#1565C0", marginBottom:5 }}>🏥 다니는 병원 등록</div>
              {[["🏥 병원명","더블유여성병원"],["📍 지역 (시·구까지)","광주 광산구"]].map(([l,v]) => (
                <div key={l} style={{ marginBottom:4 }}>
                  <div style={{ fontSize:6, color:"#888", marginBottom:1 }}>{l}</div>
                  <div style={{ background:"#F8FBFF", border:"1.5px solid #BBDEFB", borderRadius:5, padding:"3px 6px", fontSize:7 }}>{v}</div>
                </div>
              ))}
              <div style={{ background:"rgba(240,249,255,.8)", borderRadius:5, padding:"3px 6px", marginBottom:4, fontSize:6, color:"#1565C0" }}>🔍 <b>"더블유여성병원 광주 광산구"</b></div>
              <div style={{ display:"flex", gap:3 }}>
                <div style={{ flex:1, background:"#03C75A", borderRadius:6, padding:4, textAlign:"center", fontSize:6, color:"white", fontFamily:"'Jua',sans-serif" }}>🗺️ 지도 확인</div>
                <div style={{ flex:1, background:"#E3F2FD", border:"1px solid #1565C0", borderRadius:6, padding:4, textAlign:"center", fontSize:6, color:"#1565C0", fontFamily:"'Jua',sans-serif" }}>✅ 등록</div>
              </div>
            </div>
          </div>
        </div>
      </Phone>
      <div style={S.ok}>✅ 지역까지 입력하면 동일 이름 병원 여러 개 뜨는 문제 해결!</div>
    </Sec>
  </div>
);

// ── 비주얼 Android ──────────────────────────────────────────
const VisualAndroid = () => (
  <div style={{ paddingBottom:"3rem" }}>
    <Sec num="1" title="카톡 링크 열기">
      <div style={S.desc}>카톡 링크 클릭 또는 길게 눌러 <b>"Chrome으로 열기"</b> 선택.</div>
      <Phone>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px 12px", minHeight:300, background:"linear-gradient(160deg,#fff5f8,#fef6ff)" }}>
          <div style={{ fontSize:32, marginBottom:5 }}>🌸</div>
          <div style={{ fontSize:20, marginBottom:5 }}>👶</div>
          <div style={{ fontFamily:"'Jua',sans-serif", fontSize:11, color:"#880e4f", marginBottom:12 }}>Baby Journey</div>
          <div style={{ width:"100%", padding:"7px", borderRadius:10, background:"linear-gradient(135deg,#f48fb1,#f06292)", fontFamily:"'Jua',sans-serif", fontSize:9, color:"white", textAlign:"center", marginBottom:6 }}>🤰 새 가족 공간 만들기</div>
          <div style={{ width:"100%", padding:"6px", borderRadius:10, border:"1.5px solid rgba(240,98,146,.35)", background:"rgba(255,255,255,.8)", fontFamily:"'Jua',sans-serif", fontSize:9, color:"#e91e63", textAlign:"center" }}>🔑 가족 코드로 참여하기</div>
        </div>
      </Phone>
      <div style={S.ok}>✅ 안드로이드는 아이폰보다 훨씬 안정적이에요!</div>
    </Sec>

    <Sec num="2" title="홈 화면에 저장 (추천)">
      <div style={S.desc}>Chrome <b>⋮ 메뉴</b> → <b>"홈 화면에 추가"</b> 선택</div>
      <Phone>
        <div style={{ display:"flex", flexDirection:"column", minHeight:300 }}>
          <div style={{ background:"#f5f5f5", padding:"6px 8px", display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:7, color:"#333" }}>
            <span>baby-journey-mocha...</span>
            <div style={{ background:"#e91e63", borderRadius:4, padding:"2px 5px", color:"white", fontFamily:"'Jua',sans-serif", fontSize:7, position:"relative" }}>
              ⋮
              <div style={{ position:"absolute", top:-18, right:0, background:"#e91e63", color:"white", borderRadius:5, padding:"1px 5px", fontSize:6, whiteSpace:"nowrap", fontFamily:"'Jua',sans-serif" }}>← 메뉴!</div>
            </div>
          </div>
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(160deg,#fff5f8,#fef6ff)" }}>
            <div style={{ background:"white", borderRadius:10, padding:"8px 11px", boxShadow:"0 2px 10px rgba(0,0,0,.1)", width:"80%" }}>
              {["새 탭","북마크"].map(t => <div key={t} style={{ fontSize:7, padding:"4px 0", borderBottom:"1px solid #f5f5f5", color:"#333" }}>{t}</div>)}
              <div style={{ fontSize:7, padding:"4px 0", borderBottom:"1px solid #f5f5f5", fontWeight:700, color:"#e91e63" }}>홈 화면에 추가 ← 이거!</div>
              <div style={{ fontSize:7, padding:"4px 0", color:"#333" }}>공유</div>
            </div>
          </div>
        </div>
      </Phone>
      <div style={S.info}>💡 앱처럼 홈 화면에서 편하게 접속!</div>
    </Sec>

    {/* 3~6은 iOS와 비슷하므로 간략화 */}
    <Sec num="3" title="엄마 — 새 가족 공간 만들기">
      <div style={S.badgeMom}>👩 엄마(임산부)만 하세요</div>
      <div style={S.desc}>"새 가족 공간 만들기" → 비밀번호 설정 → 코드 생성! (iOS와 동일)</div>
      <div style={S.ok}>✅ 코드는 상단에 항상 표시! 📋 누르면 복사!</div>
    </Sec>
    <Sec num="4" title="엄마 — 기본 정보 입력">
      <div style={S.badgeMom}>👩 엄마만</div>
      <div style={S.desc}>✏️ 편집 탭 → 비밀번호 → 출산예정일 입력 → 주수 자동계산!</div>
      <div style={S.ok}>✅ 저장 누르면 가족들 폰에 5초 이내로 반영!</div>
    </Sec>
    <Sec num="5" title="가족 — 코드로 참여하기">
      <div style={S.badgeFam}>👨‍👩‍👧 가족</div>
      <div style={S.desc}>링크 클릭하면 자동 입장! 코드만 받으면 직접 입력 → 참여하기</div>
      <div style={S.ok}>✅ 한 번 입력 → 다음부터 자동 입장!</div>
    </Sec>
    <Sec num="6" title="홈 화면 보기">
      <div style={S.desc}>엄마 컨디션·여정·병원 정보 한눈에! ＋ 버튼으로 친구 가족 추가!</div>
      <div style={S.info}>💡 ＋ 버튼으로 친구 가족 코드 추가 후 탭 전환!</div>
    </Sec>
  </div>
);

// ── 텍스트 iOS / Android ────────────────────────────────────
const TextGuide = ({ isAndroid }) => (
  <div style={{ paddingBottom:"3rem" }}>
    <Sec num="1" title="앱 처음 열기">
      <Step icon="📱" title={isAndroid ? "Chrome에서 링크 열기" : "Safari에서 링크 열기"} desc={isAndroid ? "카톡 링크 클릭 또는 길게 눌러 "Chrome으로 열기" 선택." : "카톡 링크를 길게 눌러 "Safari로 열기" 선택."} />
      <Step icon="🔖" title="홈 화면에 저장" desc={isAndroid ? "Chrome ⋮ 메뉴 → "홈 화면에 추가" → 앱처럼 사용!" : "Safari 하단 공유 버튼(□↑) → "홈 화면에 추가""} />
      {!isAndroid && <div style={S.tip}>⚠️ <b>홈 화면 저장 필수!</b> 뒤로가기 누르면 코드가 초기화될 수 있어요!</div>}
      {isAndroid && <div style={S.ok}>✅ 안드로이드는 아이폰보다 훨씬 안정적이에요!</div>}
    </Sec>
    <Sec num="2" title="엄마 — 가족 공간 만들기">
      <div style={S.badgeMom}>👩 엄마(임산부)만</div>
      <Step icon="👶" title='"새 가족 공간 만들기" 클릭' desc="꽃잎 날리는 첫 화면에서 분홍 버튼!" />
      <Step icon="🔐" title="비밀번호 4자리 설정" desc="숫자 4자리 두 번 입력. 생일 같은 기억하기 쉬운 번호로!" />
      <Step icon="🎉" title="BABY-XXXX 코드 생성!" desc="상단 🔑 BABY-XXXX 📋 눌러 복사 → 가족 카톡 전송" />
    </Sec>
    <Sec num="3" title="엄마 — 기본 정보 입력">
      <div style={S.badgeMom}>👩 엄마만</div>
      <Step icon="✏️" title="편집 탭 → 비밀번호 입력" desc="아래 탭바 ✏️ 편집 클릭 → 비밀번호 4자리 입력" />
      <Step icon="📝" title="기본 정보 입력" desc="이름 / 태명 / 출산 예정일(→ 주수 자동계산!) / 성별" />
      <Step icon="🩺" title="오늘 증상 선택" desc="입덧·통증·기분 등 선택 → 가족에게 컨디션 전달" />
      <Step icon="💾" title="저장하기 클릭" desc="분홍 저장 버튼 → 5초 이내 가족 폰에 즉시 반영!" />
      <div style={S.ok}>✅ 출산예정일 입력 → 주수 자동계산! 저장 → 즉시 반영!</div>
    </Sec>
    <Sec num="4" title="가족 — 코드로 참여하기">
      <div style={S.badgeFam}>👨‍👩‍👧 가족 (남편·부모님·형제)</div>
      <Step icon="🔗" title="카톡 링크 클릭" desc="코드 포함된 링크면 클릭만으로 자동 입장!" />
      <Step icon="🔑" title="코드 직접 입력" desc='"🔑 가족 코드로 참여하기" → BABY-XXXX 입력 → 참여하기' />
      <div style={S.ok}>✅ 한 번 입력하면 다음부터 자동 입장!</div>
      {!isAndroid && <div style={S.tip}>⚠️ 아이폰은 홈 화면에 저장해두세요!</div>}
    </Sec>
    <Sec num="5" title="앱 화면 구성">
      <div style={S.tabGrid}>
        {[["🏠","홈","컨디션·여정·아기크기·병원"],["📅","주수","주차별 태아·산모 변화"],["🥗","음식","먹어도 되는/주의 음식"],["🏥","케어","병원·진료일정·체크리스트"],["📸","사진","초음파 사진 앨범"],["✏️","편집","엄마 전용 (비밀번호 필요)"]].map(([e,n,d]) => (
          <div key={n} style={S.tabItem}>
            <div style={{ fontSize:20, marginBottom:3 }}>{e}</div>
            <div style={{ fontFamily:"'Jua',sans-serif", fontSize:12, color:"#880e4f", marginBottom:2 }}>{n}</div>
            <div style={{ fontSize:10, color:"#777", lineHeight:1.3 }}>{d}</div>
          </div>
        ))}
      </div>
    </Sec>
    <Sec num="6" title="친구 가족도 함께 보기">
      <Step icon="➕" title="헤더 ＋ 버튼 클릭" desc="앱 상단 오른쪽 ＋ 버튼 → 가족 추가 모달" />
      <Step icon="🔑" title="친구 코드 입력" desc="BABY-XXXX 입력 → 상단 탭에 자동 추가" />
      <Step icon="👀" title="탭 클릭으로 전환" desc="💕 내 가족 / 🌸 친구네 탭 전환. 친구 가족은 읽기 전용" />
    </Sec>
    <Sec num="❓" title="자주 묻는 질문">
      {!isAndroid && <Step icon="😰" title="뒤로가기 눌렀더니 처음 화면이에요" desc="홈 화면 저장해두면 해결! 코드 다시 입력해서 재입장 가능." />}
      <Step icon="🔐" title="비밀번호 잊어버렸어요" desc="편집 탭 → 맨 아래 비밀번호 변경 항목에서 변경" />
      <Step icon="🔑" title="가족 코드 잊어버렸어요" desc="앱 상단에 항상 표시! 🔑 BABY-XXXX 📋 누르면 복사." />
      <Step icon="🔄" title="저장했는데 안 보여요" desc="최대 5초 대기. 그래도 안 되면 새로고침!" />
      <Step icon="📸" title="사진 어디서 올려요?" desc="📸 사진 탭에서 올릴 수 있어요. 엄마만 업로드 가능." />
    </Sec>
  </div>
);

// ── 메인 ────────────────────────────────────────────────────
export default function Guide() {
  const [main, setMain] = useState("visual");
  const [os, setOs] = useState("ios");

  const tabBtn = (id, label, cur, set) => (
    <button onClick={() => set(id)} style={{
      flex:1, padding:"12px 6px", border:"none", background:"none", cursor:"pointer",
      fontFamily:"'Jua',sans-serif", fontSize:13,
      color: cur===id ? "#e91e63" : "#bbb",
      borderBottom: `3px solid ${cur===id ? "#e91e63" : "transparent"}`,
      marginBottom:-3, display:"flex", alignItems:"center", justifyContent:"center", gap:5,
      background: cur===id ? "#fff5f8" : "none",
    }}>{label}</button>
  );

  return (
    <div style={{ fontFamily:"'Noto Sans KR',sans-serif", maxWidth:540, margin:"0 auto", background:"#fff9fb", minHeight:"100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Jua&family=Noto+Sans+KR:wght@400;700&display=swap'); * { box-sizing:border-box; }`}</style>

      {/* 헤더 */}
      <div style={S.header}>
        <div style={{ position:"absolute", fontSize:110, opacity:.06, top:-15, right:-10 }}>🌸</div>
        <h1 style={S.h1}>🌸 Baby Journey 사용 설명서</h1>
        <p style={S.sub}>임산부와 가족을 위한 임신 여정 공유 앱</p>
        <div style={S.url}>🔗 baby-journey-mocha.vercel.app</div>
      </div>

      {/* 메인 탭 */}
      <div style={{ ...S.mainTabs }}>
        {tabBtn("visual", "🖼️ 그림 설명서", main, setMain)}
        {tabBtn("text",   "📄 텍스트 설명서", main, setMain)}
      </div>

      {/* OS 탭 */}
      <div style={{ ...S.osTabs }}>
        {tabBtn("ios",     "🍎 iPhone (iOS)", os, setOs)}
        {tabBtn("android", "🤖 안드로이드",   os, setOs)}
      </div>

      {/* 콘텐츠 */}
      {main==="visual" && os==="ios"     && <VisualIOS/>}
      {main==="visual" && os==="android" && <VisualAndroid/>}
      {main==="text"   && os==="ios"     && <TextGuide isAndroid={false}/>}
      {main==="text"   && os==="android" && <TextGuide isAndroid={true}/>}

      <div style={{ textAlign:"center", padding:"2rem", fontSize:11, color:"#ccc", background:"white" }}>
        🌸 Baby Journey · baby-journey-mocha.vercel.app
      </div>
    </div>
  );
}
