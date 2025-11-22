import { useI18n } from './I18nContext'

export default function useTranslation() {
  const { t } = useI18n()
  return { t }
}
