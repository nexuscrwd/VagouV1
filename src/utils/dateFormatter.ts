/**
 * Formata um slot de data/horário para a síntese compacta mobile "DD/MM às HH:MM"
 * Exemplo:
 * - "Hoje • 14:30" => "02/09 às 14:30"
 * - "Amanhã • 10:00" => "03/09 às 10:00"
 * - "15:00" => "02/09 às 15:00"
 * - "02/09 às 14:30" => "02/09 às 14:30"
 */
export function formatSlotDateTime(slotStr?: string): string {
  if (!slotStr) return '';
  const trimmed = slotStr.trim();

  // Se já está no formato DD/MM às HH:MM ou DD/MM as HH:MM
  if (/^\d{2}\/\d{2}\s+(?:às|as)\s+\d{2}:\d{2}$/i.test(trimmed)) {
    return trimmed;
  }

  // Extrai apenas o horário HH:MM
  const timeMatch = trimmed.match(/(\d{1,2}:\d{2})/);
  const timeOnly = timeMatch ? timeMatch[1].padStart(5, '0') : trimmed;

  const now = new Date();
  let targetDate = now;

  if (trimmed.toLowerCase().includes('amanhã')) {
    targetDate = new Date(now);
    targetDate.setDate(now.getDate() + 1);
  }

  const day = String(targetDate.getDate()).padStart(2, '0');
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');

  return `${day}/${month} às ${timeOnly}`;
}
