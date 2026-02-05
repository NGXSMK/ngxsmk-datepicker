import { Injectable } from '@angular/core';
import { DatepickerTranslations } from '../interfaces/datepicker-translations.interface';

/**
 * Service for managing datepicker translations
 * Provides default translations for major languages
 */
@Injectable({ providedIn: 'root' })
export class TranslationRegistryService {
  private translations: Map<string, DatepickerTranslations> = new Map();

  constructor() {
    this.registerDefaultTranslations();
  }

  /**
   * Register translations for a locale
   */
  register(locale: string, translations: DatepickerTranslations): void {
    this.translations.set(locale.toLowerCase(), translations);
  }

  /**
   * Get translations for a locale with fallback support
   */
  getTranslations(locale: string): DatepickerTranslations {
    if (!locale) {
      return this.translations.get('en') || this.getEnglishTranslations();
    }

    const normalized = locale.toLowerCase();

    if (this.translations.has(normalized)) {
      return this.translations.get(normalized)!;
    }

    if (normalized.startsWith('zh-')) {
      if (
        normalized === 'zh-tw' ||
        normalized === 'zh-hk' ||
        normalized === 'zh-mo'
      ) {
        if (this.translations.has('zh-tw')) {
          return this.translations.get('zh-tw')!;
        }
        return this.translations.get('en') || this.getEnglishTranslations();
      }
      if (this.translations.has('zh')) {
        return this.translations.get('zh')!;
      }
      return this.translations.get('en') || this.getEnglishTranslations();
    }

    // Try language code only (for all other languages)
    const parts = normalized.split('-');
    const languageCode = parts.length > 0 ? parts[0] : normalized;
    if (
      languageCode &&
      languageCode !== normalized &&
      this.translations.has(languageCode)
    ) {
      return this.translations.get(languageCode)!;
    }

    return this.translations.get('en') || this.getEnglishTranslations();
  }

  /**
   * Register default translations for major languages
   */
  private registerDefaultTranslations(): void {
    this.register('en', this.getEnglishTranslations());
    this.register('en-US', this.getEnglishTranslations());
    this.register('en-GB', this.getEnglishTranslations());

    /**
     * Spanish (Español)
     * Includes support for ES and ES-ES locales
     */
    const spanishTranslations: DatepickerTranslations = {
      selectDate: 'Seleccionar fecha',
      selectTime: 'Seleccionar hora',
      clear: 'Limpiar',
      close: 'Cerrar',
      today: 'Hoy',
      selectEndDate: 'Seleccionar fecha de fin',
      day: 'Día',
      days: 'Días',
      previousMonth: 'Mes anterior',
      nextMonth: 'Mes siguiente',
      previousYear: 'Año anterior',
      nextYear: 'Año siguiente',
      previousYears: 'Años anteriores',
      nextYears: 'Años siguientes',
      previousDecade: 'Década anterior',
      nextDecade: 'Década siguiente',
      clearSelection: 'Limpiar selección',
      closeCalendar: 'Cerrar calendario',
      closeCalendarOverlay: 'Cerrar superposición del calendario',
      calendarFor: 'Calendario para {{month}} {{year}}',
      selectYear: 'Seleccionar año {{year}}',
      selectDecade: 'Seleccionar década {{start}} - {{end}}',
      datesSelected: '{{count}} fechas seleccionadas',
      timesSelected: '{{count}} veces seleccionadas',
      time: 'Hora:',
      startTime: 'Hora de inicio',
      endTime: 'Hora de fin',
      from: 'Desde',
      to: 'Hasta',
      holiday: 'Festivo',
      month: 'Mes',
      year: 'Año',
      decade: 'Década',
      timeline: 'Línea de tiempo',
      timeSlider: 'Control deslizante de tiempo',
      calendarOpened: 'Calendario abierto para {{month}} {{year}}',
      calendarClosed: 'Calendario cerrado',
      dateSelected: 'Fecha seleccionada: {{date}}',
      rangeSelected: 'Rango seleccionado: {{start}} a {{end}}',
      monthChanged: 'Cambiado a {{month}} {{year}}',
      yearChanged: 'Cambiado al año {{year}}',
      calendarLoading: 'Cargando calendario...',
      calendarReady: 'Calendario listo',
      keyboardShortcuts: 'Atajos de teclado',
    };
    this.register('es', spanishTranslations);
    this.register('es-ES', spanishTranslations);

    /**
     * French (Français)
     * Includes support for FR and FR-FR locales
     */
    const frenchTranslations: DatepickerTranslations = {
      selectDate: 'Sélectionner une date',
      selectTime: 'Sélectionner une heure',
      clear: 'Effacer',
      close: 'Fermer',
      today: "Aujourd'hui",
      selectEndDate: 'Sélectionner la date de fin',
      day: 'Jour',
      days: 'Jours',
      previousMonth: 'Mois précédent',
      nextMonth: 'Mois suivant',
      previousYear: 'Année précédente',
      nextYear: 'Année suivante',
      previousYears: 'Années précédentes',
      nextYears: 'Années suivantes',
      previousDecade: 'Décennie précédente',
      nextDecade: 'Décennie suivante',
      clearSelection: 'Effacer la sélection',
      closeCalendar: 'Fermer le calendrier',
      closeCalendarOverlay: 'Fermer la superposition du calendrier',
      calendarFor: 'Calendrier pour {{month}} {{year}}',
      selectYear: "Sélectionner l'année {{year}}",
      selectDecade: 'Sélectionner la décennie {{start}} - {{end}}',
      datesSelected: '{{count}} dates sélectionnées',
      timesSelected: '{{count}} fois sélectionnées',
      time: 'Heure:',
      startTime: 'Heure de début',
      endTime: 'Heure de fin',
      from: 'De',
      to: 'À',
      holiday: 'Jour férié',
      month: 'Mois',
      year: 'Année',
      decade: 'Décennie',
      timeline: 'Chronologie',
      timeSlider: 'Curseur de temps',
      calendarOpened: 'Calendrier ouvert pour {{month}} {{year}}',
      calendarClosed: 'Calendrier fermé',
      dateSelected: 'Date sélectionnée : {{date}}',
      rangeSelected: 'Plage sélectionnée : {{start}} à {{end}}',
      monthChanged: 'Changé pour {{month}} {{year}}',
      yearChanged: "Changé pour l'année {{year}}",
      calendarLoading: 'Chargement du calendrier...',
      calendarReady: 'Calendrier prêt',
      keyboardShortcuts: 'Raccourcis clavier',
    };
    this.register('fr', frenchTranslations);
    this.register('fr-FR', frenchTranslations);

    /**
     * German (Deutsch)
     * Includes support for DE and DE-DE locales
     */
    const germanTranslations: DatepickerTranslations = {
      selectDate: 'Datum auswählen',
      selectTime: 'Uhrzeit auswählen',
      clear: 'Löschen',
      close: 'Schließen',
      today: 'Heute',
      selectEndDate: 'Enddatum auswählen',
      day: 'Tag',
      days: 'Tage',
      previousMonth: 'Vorheriger Monat',
      nextMonth: 'Nächster Monat',
      previousYear: 'Vorheriges Jahr',
      nextYear: 'Nächstes Jahr',
      previousYears: 'Vorherige Jahre',
      nextYears: 'Nächste Jahre',
      previousDecade: 'Vorheriges Jahrzehnt',
      nextDecade: 'Nächstes Jahrzehnt',
      clearSelection: 'Auswahl löschen',
      closeCalendar: 'Kalender schließen',
      closeCalendarOverlay: 'Kalender-Overlay schließen',
      calendarFor: 'Kalender für {{month}} {{year}}',
      selectYear: 'Jahr {{year}} auswählen',
      selectDecade: 'Jahrzehnt {{start}} - {{end}} auswählen',
      datesSelected: '{{count}} Datumsangaben ausgewählt',
      timesSelected: '{{count}} Zeiten ausgewählt',
      time: 'Uhrzeit:',
      startTime: 'Startzeit',
      endTime: 'Endzeit',
      from: 'Von',
      to: 'Bis',
      holiday: 'Feiertag',
      month: 'Monat',
      year: 'Jahr',
      decade: 'Jahrzehnt',
      timeline: 'Zeitachse',
      timeSlider: 'Zeitschieberegler',
      calendarOpened: 'Kalender geöffnet für {{month}} {{year}}',
      calendarClosed: 'Kalender geschlossen',
      dateSelected: 'Datum ausgewählt: {{date}}',
      rangeSelected: 'Bereich ausgewählt: {{start}} bis {{end}}',
      monthChanged: 'Geändert zu {{month}} {{year}}',
      yearChanged: 'Geändert zu Jahr {{year}}',
      calendarLoading: 'Kalender wird geladen...',
      calendarReady: 'Kalender bereit',
      keyboardShortcuts: 'Tastaturkürzel',
    };
    this.register('de', germanTranslations);
    this.register('de-DE', germanTranslations);

    /**
     * Arabic (العربية)
     * Includes support for AR and AR-SA locales (RTL)
     */
    const arabicTranslations: DatepickerTranslations = {
      selectDate: 'اختر التاريخ',
      selectTime: 'اختر الوقت',
      clear: 'مسح',
      close: 'إغلاق',
      today: 'اليوم',
      selectEndDate: 'اختر تاريخ الانتهاء',
      day: 'يوم',
      days: 'أيام',
      previousMonth: 'الشهر السابق',
      nextMonth: 'الشهر التالي',
      previousYear: 'السنة السابقة',
      nextYear: 'السنة التالية',
      previousYears: 'السنوات السابقة',
      nextYears: 'السنوات التالية',
      previousDecade: 'العقد السابق',
      nextDecade: 'العقد التالي',
      clearSelection: 'مسح التحديد',
      closeCalendar: 'إغلاق التقويم',
      closeCalendarOverlay: 'إغلاق تراكب التقويم',
      calendarFor: 'تقويم لـ {{month}} {{year}}',
      selectYear: 'اختر السنة {{year}}',
      selectDecade: 'اختر العقد {{start}} - {{end}}',
      datesSelected: '{{count}} تواريخ محددة',
      timesSelected: '{{count}} مرات محددة',
      time: 'الوقت:',
      startTime: 'وقت البدء',
      endTime: 'وقت الانتهاء',
      from: 'من',
      to: 'إلى',
      holiday: 'عطلة',
      month: 'شهر',
      year: 'سنة',
      decade: 'عقد',
      timeline: 'الجدول الزمني',
      timeSlider: 'منزلق الوقت',
      calendarOpened: 'تم فتح التقويم لـ {{month}} {{year}}',
      calendarClosed: 'تم إغلاق التقويم',
      dateSelected: 'تم تحديد التاريخ: {{date}}',
      rangeSelected: 'تم تحديد النطاق: {{start}} إلى {{end}}',
      monthChanged: 'تم التغيير إلى {{month}} {{year}}',
      yearChanged: 'تم التغيير إلى السنة {{year}}',
      calendarLoading: 'جارٍ تحميل التقويم...',
      calendarReady: 'التقويم جاهز',
      keyboardShortcuts: 'اختصارات لوحة المفاتيح',
    };
    this.register('ar', arabicTranslations);
    this.register('ar-SA', arabicTranslations);

    /**
     * Chinese Simplified (简体中文)
     * Includes support for ZH and ZH-CN locales
     */
    const chineseSimplifiedTranslations: DatepickerTranslations = {
      selectDate: '选择日期',
      selectTime: '选择时间',
      clear: '清除',
      close: '关闭',
      today: '今天',
      selectEndDate: '选择结束日期',
      day: '天',
      days: '天',
      previousMonth: '上个月',
      nextMonth: '下个月',
      previousYear: '上一年',
      nextYear: '下一年',
      previousYears: '上几年',
      nextYears: '下几年',
      previousDecade: '上十年',
      nextDecade: '下十年',
      clearSelection: '清除选择',
      closeCalendar: '关闭日历',
      closeCalendarOverlay: '关闭日历叠加层',
      calendarFor: '{{year}}年{{month}}的日历',
      selectYear: '选择年份 {{year}}',
      selectDecade: '选择十年 {{start}} - {{end}}',
      datesSelected: '已选择 {{count}} 个日期',
      timesSelected: '已选择 {{count}} 次',
      time: '时间:',
      startTime: '开始时间',
      endTime: '结束时间',
      from: '从',
      to: '到',
      holiday: '节假日',
      month: '月',
      year: '年',
      decade: '十年',
      timeline: '时间线',
      timeSlider: '时间滑块',
      calendarOpened: '已打开 {{year}}年{{month}} 的日历',
      calendarClosed: '日历已关闭',
      dateSelected: '已选择日期: {{date}}',
      rangeSelected: '已选择范围: {{start}} 至 {{end}}',
      monthChanged: '已更改为 {{month}} {{year}}',
      yearChanged: '已更改为 {{year}} 年',
      calendarLoading: '正在加载日历...',
      calendarReady: '日历已就绪',
      keyboardShortcuts: '键盘快捷键',
    };
    this.register('zh', chineseSimplifiedTranslations);
    this.register('zh-CN', chineseSimplifiedTranslations);

    /**
     * Japanese (日本語)
     * Includes support for JA and JA-JP locales
     */
    const japaneseTranslations: DatepickerTranslations = {
      selectDate: '日付を選択',
      selectTime: '時刻を選択',
      clear: 'クリア',
      close: '閉じる',
      today: '今日',
      selectEndDate: '終了日を選択',
      day: '日',
      days: '日間',
      previousMonth: '前の月',
      nextMonth: '次の月',
      previousYear: '前の年',
      nextYear: '次の年',
      previousYears: '前の年',
      nextYears: '次の年',
      previousDecade: '前の10年',
      nextDecade: '次の10年',
      clearSelection: '選択をクリア',
      closeCalendar: 'カレンダーを閉じる',
      closeCalendarOverlay: 'カレンダーオーバーレイを閉じる',
      calendarFor: '{{year}}年{{month}}のカレンダー',
      selectYear: '年 {{year}} を選択',
      selectDecade: '10年 {{start}} - {{end}} を選択',
      datesSelected: '{{count}} 日付が選択されました',
      timesSelected: '{{count}} 回選択されました',
      time: '時刻:',
      startTime: '開始時刻',
      endTime: '終了時刻',
      from: 'から',
      to: 'まで',
      holiday: '祝日',
      month: '月',
      year: '年',
      decade: '10年',
      timeline: 'タイムライン',
      timeSlider: 'タイムスライダー',
      calendarOpened: '{{year}}年{{month}}のカレンダーを開きました',
      calendarClosed: 'カレンダーを閉じました',
      dateSelected: '日付を選択しました: {{date}}',
      rangeSelected: '範囲を選択しました: {{start}} から {{end}}',
      monthChanged: '{{month}} {{year}}に変更しました',
      yearChanged: '{{year}}年に変更しました',
      calendarLoading: 'カレンダーを読み込み中...',
      calendarReady: 'カレンダーの準備ができました',
      keyboardShortcuts: 'キーボードショートカット',
    };
    this.register('ja', japaneseTranslations);
    this.register('ja-JP', japaneseTranslations);

    /**
     * Portuguese - Brazil (Português)
     * Includes support for PT and PT-BR locales
     */
    const portugueseTranslations: DatepickerTranslations = {
      selectDate: 'Selecionar data',
      selectTime: 'Selecionar hora',
      clear: 'Limpar',
      close: 'Fechar',
      today: 'Hoje',
      selectEndDate: 'Selecionar data de término',
      day: 'Dia',
      days: 'Dias',
      previousMonth: 'Mês anterior',
      nextMonth: 'Próximo mês',
      previousYear: 'Ano anterior',
      nextYear: 'Próximo ano',
      previousYears: 'Anos anteriores',
      nextYears: 'Próximos anos',
      previousDecade: 'Década anterior',
      nextDecade: 'Próxima década',
      clearSelection: 'Limpar seleção',
      closeCalendar: 'Fechar calendário',
      closeCalendarOverlay: 'Fechar sobreposição do calendário',
      calendarFor: 'Calendário para {{month}} {{year}}',
      selectYear: 'Selecionar ano {{year}}',
      selectDecade: 'Selecionar década {{start}} - {{end}}',
      datesSelected: '{{count}} datas selecionadas',
      timesSelected: '{{count}} vezes selecionadas',
      time: 'Hora:',
      startTime: 'Hora de início',
      endTime: 'Hora de término',
      from: 'De',
      to: 'Para',
      holiday: 'Feriado',
      month: 'Mês',
      year: 'Ano',
      decade: 'Década',
      timeline: 'Linha do tempo',
      timeSlider: 'Controle deslizante de tempo',
      calendarOpened: 'Calendário aberto para {{month}} {{year}}',
      calendarClosed: 'Calendário fechado',
      dateSelected: 'Data selecionada: {{date}}',
      rangeSelected: 'Intervalo selecionado: {{start}} a {{end}}',
      monthChanged: 'Alterado para {{month}} {{year}}',
      yearChanged: 'Alterado para o ano {{year}}',
      calendarLoading: 'Carregando calendário...',
      calendarReady: 'Calendário pronto',
      keyboardShortcuts: 'Atalhos de teclado',
    };
    this.register('pt', portugueseTranslations);
    this.register('pt-BR', portugueseTranslations);

    /**
     * Russian (Русский)
     * Includes support for RU and RU-RU locales
     */
    const russianTranslations: DatepickerTranslations = {
      selectDate: 'Выбрать дату',
      selectTime: 'Выбрать время',
      clear: 'Очистить',
      close: 'Закрыть',
      today: 'Сегодня',
      selectEndDate: 'Выбрать дату окончания',
      day: 'День',
      days: 'Дней',
      previousMonth: 'Предыдущий месяц',
      nextMonth: 'Следующий месяц',
      previousYear: 'Предыдущий год',
      nextYear: 'Следующий год',
      previousYears: 'Предыдущие годы',
      nextYears: 'Следующие годы',
      previousDecade: 'Предыдущее десятилетие',
      nextDecade: 'Следующее десятилетие',
      clearSelection: 'Очистить выбор',
      closeCalendar: 'Закрыть календарь',
      closeCalendarOverlay: 'Закрыть наложение календаря',
      calendarFor: 'Календарь на {{month}} {{year}}',
      selectYear: 'Выбрать год {{year}}',
      selectDecade: 'Выбрать десятилетие {{start}} - {{end}}',
      datesSelected: 'Выбрано дат: {{count}}',
      timesSelected: 'Выбрано раз: {{count}}',
      time: 'Время:',
      startTime: 'Время начала',
      endTime: 'Время окончания',
      from: 'С',
      to: 'По',
      holiday: 'Праздник',
      month: 'Месяц',
      year: 'Год',
      decade: 'Десятилетие',
      timeline: 'Временная шкала',
      timeSlider: 'Ползунок времени',
      calendarOpened: 'Календарь открыт для {{month}} {{year}}',
      calendarClosed: 'Календарь закрыт',
      dateSelected: 'Выбрана дата: {{date}}',
      rangeSelected: 'Выбран диапазон: {{start}} по {{end}}',
      monthChanged: 'Изменено на {{month}} {{year}}',
      yearChanged: 'Изменено на год {{year}}',
      calendarLoading: 'Загрузка календаря...',
      calendarReady: 'Календарь готов',
      keyboardShortcuts: 'Сочетания клавиш',
    };
    this.register('ru', russianTranslations);
    this.register('ru-RU', russianTranslations);

    /**
     * Swedish (Svenska)
     * Includes support for SV and SV-SE locales
     */
    const swedishTranslations: DatepickerTranslations = {
      selectDate: 'Välj datum',
      selectTime: 'Välj tid',
      clear: 'Rensa',
      close: 'Stäng',
      today: 'Idag',
      selectEndDate: 'Välj slutdatum',
      day: 'Dag',
      days: 'Dagar',
      previousMonth: 'Föregående månad',
      nextMonth: 'Nästa månad',
      previousYear: 'Föregående år',
      nextYear: 'Nästa år',
      previousYears: 'Föregående år',
      nextYears: 'Nästa år',
      previousDecade: 'Föregående decennium',
      nextDecade: 'Nästa decennium',
      clearSelection: 'Rensa val',
      closeCalendar: 'Stäng kalender',
      closeCalendarOverlay: 'Stäng kalenderöverlägg',
      calendarFor: 'Kalender för {{month}} {{year}}',
      selectYear: 'Välj år {{year}}',
      selectDecade: 'Välj decennium {{start}} - {{end}}',
      datesSelected: '{{count}} datum valda',
      timesSelected: '{{count}} tider valda',
      time: 'Tid:',
      startTime: 'Starttid',
      endTime: 'Sluttid',
      from: 'Från',
      to: 'Till',
      holiday: 'Helgdag',
      month: 'Månad',
      year: 'År',
      decade: 'Decennium',
      timeline: 'Tidslinje',
      timeSlider: 'Tidsskjutare',
      calendarOpened: 'Kalender öppnad för {{month}} {{year}}',
      calendarClosed: 'Kalender stängd',
      dateSelected: 'Datum valt: {{date}}',
      rangeSelected: 'Omfång valt: {{start}} till {{end}}',
      monthChanged: 'Ändrat till {{month}} {{year}}',
      yearChanged: 'Ändrat till år {{year}}',
      calendarLoading: 'Laddar kalender...',
      calendarReady: 'Kalender redo',
      keyboardShortcuts: 'Kortkommandon',
    };
    this.register('sv', swedishTranslations);
    this.register('sv-SE', swedishTranslations);

    /**
     * Korean (한국어)
     * Includes support for KO and KO-KR locales
     */
    const koreanTranslations: DatepickerTranslations = {
      selectDate: '날짜 선택',
      selectTime: '시간 선택',
      clear: '지우기',
      close: '닫기',
      today: '오늘',
      selectEndDate: '종료일 선택',
      day: '일',
      days: '일',
      previousMonth: '이전 달',
      nextMonth: '다음 달',
      previousYear: '이전 해',
      nextYear: '다음 해',
      previousYears: '이전 해',
      nextYears: '다음 해',
      previousDecade: '이전 10년',
      nextDecade: '다음 10년',
      clearSelection: '선택 지우기',
      closeCalendar: '달력 닫기',
      closeCalendarOverlay: '달력 오버레이 닫기',
      calendarFor: '{{year}}년 {{month}} 달력',
      selectYear: '{{year}}년 선택',
      selectDecade: '{{start}} - {{end}} 10년 선택',
      datesSelected: '{{count}}개 날짜 선택됨',
      timesSelected: '{{count}}번 선택됨',
      time: '시간:',
      startTime: '시작 시간',
      endTime: '종료 시간',
      from: '부터',
      to: '까지',
      holiday: '공휴일',
      month: '월',
      year: '년',
      decade: '10년',
      timeline: '타임라인',
      timeSlider: '시간 슬라이더',
      calendarOpened: '{{year}}년 {{month}} 달력이 열렸습니다',
      calendarClosed: '달력이 닫혔습니다',
      dateSelected: '날짜 선택됨: {{date}}',
      rangeSelected: '범위 선택됨: {{start}} ~ {{end}}',
      monthChanged: '{{month}} {{year}}로 변경됨',
      yearChanged: '{{year}}년으로 변경됨',
      calendarLoading: '달력 로딩 중...',
      calendarReady: '달력 준비됨',
      keyboardShortcuts: '키보드 단축키',
    };
    this.register('ko', koreanTranslations);
    this.register('ko-KR', koreanTranslations);

    /**
     * Chinese Traditional (繁體中文)
     * Specific support for ZH-TW locale
     */
    this.register('zh-TW', {
      selectDate: '選擇日期',
      selectTime: '選擇時間',
      clear: '清除',
      close: '關閉',
      today: '今天',
      selectEndDate: '選擇結束日期',
      day: '天',
      days: '天',
      previousMonth: '上個月',
      nextMonth: '下個月',
      previousYear: '上一年',
      nextYear: '下一年',
      previousYears: '上幾年',
      nextYears: '下幾年',
      previousDecade: '上十年',
      nextDecade: '下十年',
      clearSelection: '清除選擇',
      closeCalendar: '關閉日曆',
      closeCalendarOverlay: '關閉日曆疊加層',
      calendarFor: '{{year}}年{{month}}的日曆',
      selectYear: '選擇年份 {{year}}',
      selectDecade: '選擇十年 {{start}} - {{end}}',
      datesSelected: '已選擇 {{count}} 個日期',
      timesSelected: '已選擇 {{count}} 次',
      time: '時間:',
      startTime: '開始時間',
      endTime: '結束時間',
      from: '從',
      to: '到',
      holiday: '節假日',
      month: '月',
      year: '年',
      decade: '十年',
      timeline: '時間線',
      timeSlider: '時間滑塊',
      calendarOpened: '已打開 {{year}}年{{month}} 的日曆',
      calendarClosed: '日曆已關閉',
      dateSelected: '已選擇日期: {{date}}',
      rangeSelected: '已選擇範圍: {{start}} 至 {{end}}',
      monthChanged: '已更改為 {{month}} {{year}}',
      yearChanged: '已更改為 {{year}} 年',
      calendarLoading: '正在載入日曆...',
      calendarReady: '日曆已就緒',
      keyboardShortcuts: '鍵盤快捷鍵',
    });
  }

  /**
   * Get English translations (default)
   */
  private getEnglishTranslations(): DatepickerTranslations {
    return {
      selectDate: 'Select date',
      selectTime: 'Select time',
      clear: 'Clear',
      close: 'Close',
      today: 'Today',
      selectEndDate: 'Select end date',
      day: 'Day',
      days: 'Days',
      previousMonth: 'Previous month',
      nextMonth: 'Next month',
      previousYear: 'Previous year',
      nextYear: 'Next year',
      previousYears: 'Previous years',
      nextYears: 'Next years',
      previousDecade: 'Previous decade',
      nextDecade: 'Next decade',
      clearSelection: 'Clear selection',
      closeCalendar: 'Close calendar',
      closeCalendarOverlay: 'Close calendar overlay',
      calendarFor: 'Calendar for {{month}} {{year}}',
      selectYear: 'Select year {{year}}',
      selectDecade: 'Select decade {{start}} - {{end}}',
      datesSelected: '{{count}} dates selected',
      timesSelected: '{{count}} times selected',
      time: 'Time:',
      startTime: 'Start Time',
      endTime: 'End Time',
      from: 'From',
      to: 'To',
      holiday: 'Holiday',
      month: 'Month',
      year: 'Year',
      decade: 'Decade',
      timeline: 'Timeline',
      timeSlider: 'Time Slider',
      calendarOpened: 'Calendar opened for {{month}} {{year}}',
      calendarClosed: 'Calendar closed',
      dateSelected: 'Date selected: {{date}}',
      rangeSelected: 'Range selected: {{start}} to {{end}}',
      monthChanged: 'Changed to {{month}} {{year}}',
      yearChanged: 'Changed to year {{year}}',
      calendarLoading: 'Loading calendar...',
      calendarReady: 'Calendar ready',
      keyboardShortcuts: 'Keyboard shortcuts',
    };
  }
}
