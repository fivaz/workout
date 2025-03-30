import { Outlet } from 'react-router';
import AuthProvider from '@/lib/auth/AuthProvider';
import { ExerciseProvider } from '@/lib/exercise/ExerciseProvider';
import { ToastContainer } from 'react-toastify';
import { ProgramProvider } from '@/lib/program/ProgramProvider';
import Footer from '@/routes/auth/Footer';

export default function AuthLayout() {
	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-1 overflow-y-auto pb-[65px] h-full flex flex-col p-4 md:max-w-[700px] md:mx-auto w-full">
				<ToastContainer
					position="top-right"
					autoClose={1000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
				<AuthProvider>
					<ProgramProvider>
						<ExerciseProvider>
							<Outlet />
						</ExerciseProvider>
					</ProgramProvider>
				</AuthProvider>
			</main>
			<Footer />
		</div>
	);
}
