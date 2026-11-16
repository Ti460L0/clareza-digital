import { useState } from 'react';
import transcripts from '../../../packages/content/narrated-transcripts.json';

const videos: Record<string, { file: string; title: string; duration: string; size: string; vertical?: boolean }> = {
  SmsEntrega: { file: 'Aula-S1', title: 'Antes de clicar', duration: '4min42s', size: '4,8 MB' },
  FamiliarNumeroNovo: { file: 'Aula-S2', title: 'Quem está falando?', duration: '4min59s', size: '5,1 MB' },
  CentralBancaria: { file: 'Aula-S3', title: 'Falsa central e códigos', duration: '4min14s', size: '4 MB' },
  DominioEmFoco: { file: 'Aula-S4', title: 'Benefícios, ofertas e endereços', duration: '4min55s', size: '4,9 MB' },
  Incidentes: { file: 'Aula-S5', title: 'Já interagi. E agora?', duration: '4min58s', size: '5,1 MB' },
  PrimeiraConversaIA: { file: 'Aula-I4', title: 'Conversar, pesquisar e proteger informações', duration: '5min37s', size: '5,3 MB' },
  ProtecaoDadosIA: { file: 'Aula-I4-extra', title: 'Como proteger dados ao usar IA', duration: '1min07s', size: '1,4 MB', vertical: true },
};
export function hasNarratedLesson(id: string) { return !!videos[id]; }
export function NarratedLesson({ id }: { id: string }) {
  const video = videos[id];
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  if (!video) return null;
  const text = transcripts[video.file as keyof typeof transcripts];
  const width = video.vertical ? 720 : 1280;
  const height = video.vertical ? 1280 : 720;
  return <section className={`media narrated-lesson${video.vertical ? ' video-vertical' : ''}`} aria-label={`Videoaula: ${video.title}`}>
    <div className="video-intro"><p className="media-label">Sua aula em vídeo · Com narração</p>
      <h2>{video.vertical ? 'Reforce o cuidado com seus dados' : 'Assista e depois pratique'}</h2>
      <p>{video.title} · {video.duration} · {video.size}</p>
      <p>Uma explicação com exemplos para acompanhar no seu ritmo. Você também pode estudar pelo texto abaixo.</p>
    </div>
    {!playing ? <div className="video-cover">
      <img src={`/media/${video.file}.jpg`} width={width} height={height} alt={`Capa da videoaula ${video.title}`} />
      <button onClick={() => setPlaying(true)}><span aria-hidden="true">▶</span> Assistir à videoaula</button>
    </div> : failed ? <p className="notice" role="status">O vídeo não pôde ser carregado. Continue pelo texto e pelos exercícios abaixo.</p> : <video controls preload="metadata" width={width} height={height} poster={`/media/${video.file}.jpg`} onError={() => setFailed(true)}>
      <source src={`/media/${video.file}.mp4`} type="video/mp4" onError={() => setFailed(true)} />
      <track kind="captions" src={`/media/${video.file}.pt-BR.vtt`} srcLang="pt-BR" label="Português brasileiro" default />
      Seu navegador não reproduz este vídeo. Use o texto da aula.
    </video>}
    <p className="fine">Vídeo e voz gerados com IA no NotebookLM, a partir do conteúdo da aula. Exemplos fictícios. Use a tela cheia para ampliar e o botão de legendas para acompanhar sem som. Legendas e transcrição automáticas podem conter erros.</p>
    <details><summary>Ler a transcrição da narração</summary>{text.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</details>
    <a className="button secondary" href="#pratica-da-aula">Ir para a explicação e a prática ↓</a>
  </section>;
}
