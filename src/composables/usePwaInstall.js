import { ref } from 'vue';
import { toast } from 'vue-sonner';

const deferredPrompt = ref(null);
const canInstall = ref(false);

export function usePwaInstall() {
  const handleBeforeInstallPrompt = (event) => {
    event.preventDefault();
    deferredPrompt.value = event;
    canInstall.value = true;
  };

  const installPwa = async () => {
    if (!deferredPrompt.value) {
      toast.info('현재 브라우저에서는 앱 설치를 바로 진행할 수 없어요.', {
        description: '설치 가능 환경이 아니거나 이미 설치된 상태일 수 있습니다.',
      });
      return;
    }

    deferredPrompt.value.prompt();

    const choiceResult = await deferredPrompt.value.userChoice;

    if (choiceResult.outcome === 'accepted') {
      toast.success('앱 설치를 진행합니다.');
    } else {
      toast('앱 설치가 취소되었어요.');
    }

    deferredPrompt.value = null;
    canInstall.value = false;
  };

  return {
    deferredPrompt,
    canInstall,
    handleBeforeInstallPrompt,
    installPwa,
  };
}
