import { courses } from '../../../packages/content';
const pages: Record<string, string> = {
  '/': 'Aprender com calma', '/cursos': 'Cursos', '/praticar': 'Praticar com segurança',
  '/preciso-de-ajuda': 'Consulta rápida', '/fontes': 'Fontes e revisão',
  '/privacidade': 'Privacidade e progresso', '/sobre': 'Sobre o projeto',
};
export function pageTitle(path: string) {
  let title = pages[path];
  if (!title) {
    const match = /^\/cursos\/([^/]+)(?:\/aulas\/([^/]+)(\/consulta)?)?$/.exec(path);
    const course = courses.find(item => item.id === match?.[1]);
    const lesson = course?.lessons.find(item => item.id === match?.[2]);
    title = match?.[2] ? (lesson ? `${lesson.title}${match[3] ? ' — material de consulta' : ''}` : 'Aula não encontrada') : course?.title ?? 'Página não encontrada';
  }
  return `${title} | Clareza Digital`;
}
