import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import ReclamacionesForm from './reclamaciones-form';

export default function LibroReclamacionesPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />
      <ReclamacionesForm />
      <Footer />
    </div>
  );
}
