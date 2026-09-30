/**
 * Descriptive alt texts for the blog images (all were empty on WordPress — spec §8.1).
 * Keyed by legacy path, so they survive re-running `pnpm blog:migrate`.
 * The <img> of MDX content and the post covers read from here.
 */
export const blogImageAlts: Record<string, string> = {
  // Covers
  "2024/03/CANVAS-IMAGES-2024-03-19T124328.292.png":
    "Candidata conversando com uma recrutadora em uma sala de espera de escritório",
  "2023/01/28-1.jpg": "Detalhe colorido de uma cabeça de leão chinês usada nas festas de Ano Novo",
  "2022/06/pexels-photo-1181605-1.jpeg": "Duas mulheres sentadas à mesa em uma entrevista de emprego, com cadernos abertos",
  "2022/06/pexels-photo-1595385.webp": "Equipe jovem reunida em volta de uma mesa com notebooks, trabalhando em conjunto",
  "2022/06/pexels-photo-355948.jpeg": "Lâmpada no centro de um quadro-negro cercada por balões de ideias desenhados a giz",
  "2022/04/8-maneiras-de-dar-aos-alunos-mais-controle-sobre-seus-resultados-de-aprendizagem-1.jpeg":
    "Grupo de alunos levantando as mãos em uma sala de reunião, em preto e branco",
  "2022/04/8-maneiras-de-utilizar-metodologias-ativas-e-ter-alunos-e-profissionais-mais-engajados-1.jpeg":
    "Colegas sorrindo enquanto discutem uma ideia em um tablet",
  "2022/04/8-expressoes-importantes-para-celebrar-todas-as-mulheres-1.jpeg":
    "Grupo de mulheres de diferentes origens rindo e abraçadas em frente a uma parede branca",
  "2022/04/Gamification-vs.-game-based-learning-1.jpeg":
    "Jovem sorridente diante de um notebook na mesa da cozinha",
  "2022/04/9-expressoes-que-voce-precisa-aprender-neste-Ramada-1.jpeg":
    "Lanterna decorativa com uma vela acesa em um fundo escuro",
  "2022/04/Sexta-feira-Santa-Sabado-de-Aleluia-Domingo-de-Pascoa--em-ingles-1.jpeg":
    "Cartão escrito “Happy Easter!” entre flores lilases, presentes e macarons",
  "2022/04/pexels-photo-3182781-1.jpeg": "Equipe em reunião ao redor de uma mesa de madeira com notebooks",
  "2022/04/pexels-photo-9052189-1.jpeg": "Estudante sorridente usando um notebook sentada no chão",
  "2022/04/pexels-photo-3541364-1.jpeg": "Laranjeira carregada de frutas contra o céu azul, com o sol entre as folhas",
  // Inline images
  "wpcom/2021/11/pexels-photo-935943.jpeg":
    "Professora em pé ao lado de um quadro, explicando uma atividade para a turma",
  "wpcom/2021/11/design-thinking.png":
    "Infográfico do processo de design thinking: Empathize, Define, Ideate, Prototype e Test",
  "wpcom/2021/11/design-thinking-2.png":
    "Infográfico do design thinking aplicado à educação, com as cinco etapas adaptadas para a sala de aula",
};
