import { useState } from "react";
import { stories } from "../../../packages/video/src/stories";
import { hasNarratedLesson, NarratedLesson } from './NarratedLesson';
export const lessonMedia: Record<string, string> = {
  'antes-de-clicar': 'SmsEntrega', 'quem-esta-falando': 'FamiliarNumeroNovo',
  'falsa-central': 'CentralBancaria', 'ofertas-e-enderecos': 'DominioEmFoco',
  'conversar-com-ia': 'PrimeiraConversaIA', 'investigar-noticia': 'NoticiaEFontes',
  'ja-interagi': 'Incidentes',
};
export function Media({ id }: { id: string }) {
  const story = stories.find((s) => s.id === id);
  const [show, setShow] = useState(false);
  const [failed, setFailed] = useState(false);
  if (hasNarratedLesson(id)) return <><NarratedLesson id={id} />{id === 'PrimeiraConversaIA' && <details className="media"><summary>Vídeo curto: como proteger dados ao usar IA · Vertical · 1min07s</summary><NarratedLesson id="ProtecaoDadosIA" /></details>}</>;
  if (!story) return null;
  return (
    <section className="media">
      <p className="media-label">Veja na prática · Animação educativa</p>
      <h3>Demonstração: {story.scenes[0].title}</h3>
      <p>
        Vídeo sem áudio, com {story.sceneSeconds * 4} segundos. Todo o conteúdo
        também está em texto abaixo.
      </p>
      {!show ? (
        <button className="secondary" onClick={() => setShow(true)}>
          Carregar vídeo opcional
        </button>
      ) : failed ? (
        <p role="status">
          O vídeo não pôde ser carregado. Use a sequência em texto abaixo; ela
          contém as mesmas informações.
        </p>
      ) : (
        <video
          controls
          preload="none"
          width="960"
          height="960"
          poster={`/media/${id}.png`}
          onError={() => setFailed(true)}
        >
          <source
            src={`/media/${id}.mp4`}
            type="video/mp4"
            onError={() => setFailed(true)}
          />
          Seu navegador não reproduz este vídeo. Leia a sequência abaixo.
        </video>
      )}
      <details>
        <summary>Ler transcrição e sequência estática</summary>
        <p>
          Quatro telas aparecem em sequência. O quadro de exemplo surge
          suavemente; a animação não acrescenta informação além do texto.
        </p>
        <ol>
          {story.scenes.map((s) => (
            <li key={s.title}>
              <strong>{s.title}</strong>
              <p>{s.example}</p>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        <p>
          Rótulo permanente: simulação educativa. Exemplos fictícios. Você pode
          pausar no seu tempo.
        </p>
      </details>
    </section>
  );
}
