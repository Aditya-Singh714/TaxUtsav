const calculateHRAValues = ({
  basicSalary,
  da,
  hraReceived,
  rentPaid,
  isMetro,
}) => {
  const salary = basicSalary + da;

  const rule1 = hraReceived; // Actual HRA received
  const rule2 = (isMetro ? 0.5 : 0.4) * salary; // 50% or 40% of salary
  const rule3 = rentPaid - 0.1 * salary; // Rent paid - 10% of salary

  const exemptedHRA = Math.max(0, Math.min(rule1, rule2, rule3));
  const taxableHRA = hraReceived - exemptedHRA;

  return {
    salary,
    hraReceived,
    exemptedHRA,
    taxableHRA,
    rules: {
      rule1_actualHRA: rule1,
      rule2_salaryPercent: rule2,
      rule3_rentMinus10Percent: rule3,
    },
  };
};

// POST method (body params)
export const calculateHRA = (req, res) => {
  const { basicSalary, da, hraReceived, rentPaid, isMetro } = req.body;
  const result = calculateHRAValues({
    basicSalary,
    da,
    hraReceived,
    rentPaid,
    isMetro,
  });
  res.json(result);
};

// GET method (query params)
export const calculateHRAGet = (req, res) => {
  const { basicSalary, da, hraReceived, rentPaid, isMetro } = req.query;

  const result = calculateHRAValues({
    basicSalary: Number(basicSalary),
    da: Number(da),
    hraReceived: Number(hraReceived),
    rentPaid: Number(rentPaid),
    isMetro: isMetro === "true", // query param is string
  });

  res.json(result);
};
