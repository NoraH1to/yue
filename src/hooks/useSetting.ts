import { useSettingStore } from '@/store/settings';

export const useSetting = () => {
  const { state: setting, ...actions } = useSettingStore();
  return [setting, actions] as const;
};

export default useSetting;
