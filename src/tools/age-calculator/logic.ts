export function process(
  values: Record<string, string | number>
): Record<string, string | number> {
  const birthStr = String(values.birthDate || "").trim();
  const birth = new Date(birthStr);

  if (isNaN(birth.getTime())) {
    return {
      age: "날짜 형식을 확인하세요 (YYYY-MM-DD)",
      koreanAge: "-",
      days: "-",
      nextBirthday: "-",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  birth.setHours(0, 0, 0, 0);

  // International (만) age
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  // Korean age
  const koreanAge = today.getFullYear() - birth.getFullYear() + 1;

  // Days lived
  const diffMs = today.getTime() - birth.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Days until next birthday
  const thisYearBirthday = new Date(
    today.getFullYear(),
    birth.getMonth(),
    birth.getDate()
  );
  let nextBirthdayMs: number;
  if (thisYearBirthday.getTime() > today.getTime()) {
    nextBirthdayMs = thisYearBirthday.getTime() - today.getTime();
  } else if (thisYearBirthday.getTime() === today.getTime()) {
    nextBirthdayMs = 0;
  } else {
    const nextYearBirthday = new Date(
      today.getFullYear() + 1,
      birth.getMonth(),
      birth.getDate()
    );
    nextBirthdayMs = nextYearBirthday.getTime() - today.getTime();
  }
  const nextBirthday = Math.round(nextBirthdayMs / (1000 * 60 * 60 * 24));

  return {
    age,
    koreanAge,
    days: days.toLocaleString(),
    nextBirthday,
  };
}
