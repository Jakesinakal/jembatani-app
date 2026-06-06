/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';
import { ROUTES } from '@/lib/routes';
import { Step1Account } from '@/features/auth/register/Step1Account';
import { Step3Role } from '@/features/auth/register/Step3Role';
import { Step4Location } from '@/features/auth/register/Step4Location';

const TOTAL_STEPS = 3;

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mainRole, setMainRole] = useState<UserRole | null>(null);
  const [province, setProvince] = useState('Jawa Barat');
  const [city, setCity] = useState('Garut');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNextStep = async () => {
    setErrorMsg('');
    if (step === 1) {
      if (!fullName || !email || !password || !confirmPassword) {
        setErrorMsg('Harap lengkapi semua bidang yang wajib diisi.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Kata sandi minimal 6 karakter.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Kata sandi dan konfirmasi kata sandi tidak cocok.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!mainRole) {
        setErrorMsg('Pilih salah satu peran utama Anda terlebih dahulu.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (selectedCrops.length < 3) {
        setErrorMsg('Pilih minimal 3 komoditas minat untuk mempersonalisasi beranda.');
        return;
      }

      setIsLoading(true);
      const { error } = await signUp(email, password, {
        name: fullName,
        phone,
        role: mainRole,
        location: `${city}, ${province}`,
        crops: selectedCrops,
      });
      setIsLoading(false);

      if (error) {
        setErrorMsg(error);
        return;
      }
      navigate(ROUTES.BERANDA);
    }
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-surface flex flex-col justify-between px-5 py-8">
      <div>
        <div className="flex items-center justify-between mt-2 mb-8">
          <button
            onClick={handlePrevStep}
            className="p-1 px-3 py-1.5 bg-surface-container rounded-full text-primary font-bold text-label-md flex items-center gap-1 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5" /> Kembali
          </button>
          <div className="flex items-center gap-2">
            <span className="text-body-sm font-bold font-jakarta text-on-surface-variant">
              Langkah {step} dari {TOTAL_STEPS}
            </span>
          </div>
        </div>

        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        {errorMsg && (
          <div className="text-error bg-error-container/20 border border-error-container p-3 rounded-lg text-body-sm font-semibold mb-6">
            {errorMsg}
          </div>
        )}

        {step === 1 && (
          <Step1Account
            fullName={fullName}
            setFullName={setFullName}
            phone={phone}
            setPhone={setPhone}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
          />
        )}
        {step === 2 && <Step3Role mainRole={mainRole} setMainRole={setMainRole} />}
        {step === 3 && (
          <Step4Location
            province={province}
            setProvince={setProvince}
            city={city}
            setCity={setCity}
            selectedCrops={selectedCrops}
            setSelectedCrops={setSelectedCrops}
          />
        )}
      </div>

      <div className="mt-8">
        <Button
          id="wizard-submit-btn"
          type="button"
          variant="primary"
          fullWidth
          onClick={handleNextStep}
          className="py-3.5 shadow-md"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Mendaftarkan...
            </span>
          ) : step === TOTAL_STEPS ? (
            'Selesaikan Pendaftaran (Mulai)'
          ) : (
            'Lanjutkan'
          )}
        </Button>
      </div>
    </div>
  );
}
