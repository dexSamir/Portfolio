export const publicPages: Record<string, { title: string; description: string }> = {
  '/': { title:'Samir Habibov | Fullstack Developer', description:'Explore Samir Habibov’s portfolio, projects, skills and resume. Fullstack development with ASP.NET Core, C#, React and TypeScript in Baku, Azerbaijan.' },
  '/projects': { title:'Projects | Samir Habibov', description:'Explore web applications and software projects built by Samir Habibov using React, ASP.NET Core and modern development tools.' },
  '/resume': { title:'Resume & CV | Samir Habibov', description:'View Samir Habibov’s education, technical skills and languages, and download his professional CV as a PDF.' },
  '/contact': { title:'Contact | Samir Habibov', description:'Contact Samir Habibov for development projects and collaboration. Reach out by email, phone or WhatsApp.' },
  '/testimonials': { title:'Testimonials | Samir Habibov', description:'Read feedback from clients and colleagues, and share your experience working with Samir Habibov.' },
};
export function pageMetadata(path: string) {
  return publicPages[path] || { title: path.startsWith('/admin') ? 'Admin | Samir Habibov' : path === '/login' ? 'Admin Login | Samir Habibov' : path === '/403' ? 'Access Denied | Samir Habibov' : 'Page Not Found | Samir Habibov', description:'Samir Habibov’s portfolio.' };
}
