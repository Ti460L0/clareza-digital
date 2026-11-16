"""Local draft captions. Review text and timing before publishing."""
import json
from pathlib import Path
from faster_whisper import WhisperModel

root = Path(__file__).resolve().parents[1]
folder = root / 'output' / 'notebooklm'
model = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=4,
                     download_root=str(root / 'private' / 'whisper-models'))
def stamp(seconds):
    milliseconds = round(seconds * 1000)
    return f'{milliseconds // 3600000:02}:{milliseconds // 60000 % 60:02}:{milliseconds // 1000 % 60:02}.{milliseconds % 1000:03}'
for name, code in [('Clareza_Digital_S1.mp4', 'S1'), ('S2__Quem_está_falando_.mp4', 'S2'), ('Falsa_Central_e_Códigos.mp4', 'S3'), ('Clareza_Digital_-_Benefícios.mp4', 'S4'), ('Já_interagi.mp4', 'S5'), ('Clareza_Digital.mp4', 'I4'), ('Como_Proteger_Dados_ao_Usar_IA.mp4', 'I4-extra')]:
    target = folder / f'{code}-narracao.json'
    if target.exists():
        print(f'{code}: rascunho existente preservado', flush=True)
        continue
    segments, info = model.transcribe(str(folder / name), language='pt', beam_size=5,
                                     vad_filter=True, condition_on_previous_text=False)
    rows = []
    for segment in segments:
        rows.append({'start': segment.start, 'end': segment.end, 'text': segment.text.strip()})
        print(f'{code} {segment.end:.0f}s', flush=True)
    target.write_text(json.dumps({'language': info.language, 'segments': rows, 'reviewed': False}, ensure_ascii=False, indent=2), encoding='utf8')
    cues = ['WEBVTT', '']
    for i, row in enumerate(rows, 1):
        cues += [str(i), f'{stamp(row["start"])} --> {stamp(row["end"])}', row['text'], '']
    (folder / f'{code}-rascunho.vtt').write_text('\n'.join(cues), encoding='utf8')
    print(f'{code}: transcrição rascunho concluída', flush=True)
