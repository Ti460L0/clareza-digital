import {AbsoluteFill, Composition, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {stories} from './stories';

export const EducationalScene = ({title, text, example, number}:{title:string;text:string;example:string;number:number}) => {
 const frame=useCurrentFrame(); const {fps}=useVideoConfig();
 return <AbsoluteFill style={{backgroundColor:'#f6f7ef',color:'#153f36',fontFamily:'Arial, sans-serif',padding:80}}>
  <div style={{fontSize:26,letterSpacing:3,fontWeight:700}}>CLAREZA DIGITAL · SIMULAÇÃO EDUCATIVA</div>
  <div style={{fontSize:38,marginTop:60,color:'#547249'}}>0{number} / 04</div>
  <h1 style={{fontSize:70,lineHeight:1.1,letterSpacing:-2,margin:'26px 0 35px'}}>{title}</h1>
  <div style={{border:'3px solid #adc09a',borderRadius:24,padding:35,backgroundColor:'#e5edda',fontSize:43,lineHeight:1.3,whiteSpace:'pre-line',opacity:interpolate(frame,[0,fps*.5],[0.25,1],{extrapolateRight:'clamp'}),translate:interpolate(frame,[0,fps*.5],['0px 12px','0px 0px'],{extrapolateRight:'clamp'})}}>{example}</div>
  <p style={{fontSize:38,lineHeight:1.4,marginTop:35}}>{text}</p>
  <div style={{position:'absolute',bottom:55,left:80,fontSize:25}}>Exemplo fictício · Pause o vídeo para ler no seu tempo</div>
 </AbsoluteFill>;
};
export const EducationalVideo=({storyId}:{storyId:string})=>{const {fps}=useVideoConfig(); const story=stories.find(s=>s.id===storyId)!;return <>{story.scenes.map((s,i)=><Sequence key={s.title} name={s.title} from={i*story.sceneSeconds*fps} durationInFrames={story.sceneSeconds*fps} premountFor={fps}><EducationalScene {...s} number={i+1}/></Sequence>)}</>;};
export const MyComposition=()=> <>
 <Composition id="SmsEntrega" component={EducationalVideo} width={960} height={960} fps={24} durationInFrames={960} defaultProps={{storyId:'SmsEntrega'}}/>
 <Composition id="FamiliarNumeroNovo" component={EducationalVideo} width={960} height={960} fps={24} durationInFrames={960} defaultProps={{storyId:'FamiliarNumeroNovo'}}/>
 <Composition id="DominioEmFoco" component={EducationalVideo} width={960} height={960} fps={24} durationInFrames={1152} defaultProps={{storyId:'DominioEmFoco'}}/>
 <Composition id="CentralBancaria" component={EducationalVideo} width={960} height={960} fps={24} durationInFrames={960} defaultProps={{storyId:'CentralBancaria'}}/>
 <Composition id="PrimeiraConversaIA" component={EducationalVideo} width={960} height={960} fps={24} durationInFrames={1152} defaultProps={{storyId:'PrimeiraConversaIA'}}/>
 <Composition id="NoticiaEFontes" component={EducationalVideo} width={960} height={960} fps={24} durationInFrames={1152} defaultProps={{storyId:'NoticiaEFontes'}}/>
 <Composition id="CenaEducativa" component={EducationalScene} width={960} height={960} fps={24} durationInFrames={240} defaultProps={{title:'Uma pausa ajuda',text:'Confira pelo caminho que você já conhece.',example:'Uma mensagem pede ação urgente.',number:1}}/>
 </>;

