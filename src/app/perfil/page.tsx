
import { verifySession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import ProfileForm from './profile-form';

export default async function PerfilPage() {
  const session = await verifySession();

  if (!session || session.role !== 'PATIENT') {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  if (!user) return <div>Usuario no encontrado</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-[#0c2340] mb-2">Mis Datos Personales</h1>
        <p className="text-slate-600 mb-8">Mantén tu información actualizada para una mejor atención</p>

        <ProfileForm user={user} />
      </main>
    </div>
  );
}