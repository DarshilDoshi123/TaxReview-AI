import React, { useState } from 'react';
import SEO from '../../components/SEO';
import { 
  BookOpen, 
  Search, 
  CheckSquare, 
  HelpCircle, 
  Info, 
  Scale, 
  Plus, 
  AlertTriangle,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

const IncomeTaxGuide = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState('what-is-tax');

  const topics = [
    {
      id: 'what-is-tax',
      title: 'What is Income Tax?',
      category: 'Basics',
      content: `Income tax is a direct tax levied by the Government of India on the annual earnings of individuals, Hindu Undivided Families (HUFs), corporates, and other entities. 
      Under Indian tax laws, your income is grouped into five main categories:
      
      1. Salary Income: Wages, allowances, and pension earnings.
      2. House Property Income: Rental income from owned residential or commercial properties.
      3. Business & Profession: Profits earned by freelancers, self-employed consultants, or shopkeepers.
      4. Capital Gains: Profits from selling assets like properties, shares, or mutual funds.
      5. Other Sources: Savings interest, fixed deposit interest, lottery wins, and dividends.
      
      The total sum from these five sources is your Gross Total Income, which is reduced by legal deductions before final tax computation.`
    },
    {
      id: 'regimes',
      title: 'Old vs New Tax Regime',
      category: 'Regimes',
      content: `India currently offers taxpayers a choice between two distinct tax regimes:
      
      - New Tax Regime (Default): Features lower tax rates across multiple simplified slabs but removes almost all standard exemptions and deductions. The Standard Deduction has been increased to ₹75,000 for salaried employees, and Section 87A rebate is available for taxable incomes up to ₹12,00,000.
      - Old Tax Regime: Features higher tax rates across fewer slabs but allows a wide range of deductions (Section 80C, 80D, HRA, home loan interest, LTA) to lower taxable income. Standard Deduction is ₹50,000, and Section 87A rebate is available for taxable incomes up to ₹5,00,000.
      
      The New Regime is now the default option. If you wish to claim Section 80C, 80D, and HRA, you must actively opt into the Old Regime when filing your return.`
    },
    {
      id: 'sec87a',
      title: 'Section 87A Rebate',
      category: 'Rebates',
      content: `Section 87A provides a tax rebate to lower-income resident individuals, effectively reducing their tax liability to zero:
      - New Tax Regime: Resident individuals with a net taxable income of up to ₹12,00,000 are eligible for a rebate of up to ₹60,000, making their effective tax zero.
      - Old Tax Regime: Resident individuals with a net taxable income of up to ₹5,00,000 are eligible for a rebate of up to ₹12,500, making their effective tax zero.
      
      Note: This rebate is only available to resident individuals. If taxable income exceeds the threshold even by a small amount, tax is calculated on the full income, though marginal relief may apply to reduce disproportionate tax burdens under the New Regime.`
    },
    {
      id: 'standard-deduction',
      title: 'Standard Deduction',
      category: 'Deductions',
      content: `Standard deduction is a flat tax deduction available to all salaried employees and pensioners, irrespective of actual expenses. 
      For FY 2025-26, the standard deduction is:
      - ₹75,000 under the New Tax Regime.
      - ₹50,000 under the Old Tax Regime.
      
      This deduction is automatically deducted from your gross salary by your employer before computing tax.`
    },
    {
      id: 'sec80c',
      title: 'Section 80C Deductions',
      category: 'Deductions',
      content: `Section 80C is the most popular investment deduction under the Old Tax Regime. It allows taxpayers to reduce their taxable income by up to ₹1.5 Lakhs annually by investing in specified schemes.
      Eligible items include:
      - Employee Provident Fund (EPF)
      - Public Provident Fund (PPF)
      - National Savings Certificates (NSC)
      - Equity Linked Savings Schemes (ELSS Mutual Funds)
      - Principal repayment of Home Loans
      - Life Insurance Premiums
      - Children's School Tuition Fees`
    },
    {
      id: 'sec80d',
      title: 'Section 80D Deductions',
      category: 'Deductions',
      content: `Section 80D allows deductions on health insurance premiums paid for self, spouse, children, and parents under the Old Regime.
      - Self/Family: Up to ₹25,000 (₹50,000 if self/spouse is a senior citizen).
      - Parents: Additional deduction of up to ₹25,000 (₹50,000 if parents are senior citizens).
      
      This section also covers preventive health check-up expenses up to ₹5,000 (within the overall limits).`
    },
    {
      id: 'nps',
      title: 'NPS Pension Deductions',
      category: 'Deductions',
      content: `The National Pension System (NPS) offers multiple tax deductions under both Old and New Tax Regimes:
      - Section 80CCD(1): Employee contribution up to 10% of basic salary + DA (under the overall Section 80C limit of ₹1.5 Lakhs).
      - Section 80CCD(1B): Additional self-contribution up to ₹50,000, allowed ONLY under the Old Tax Regime. This is over and above the ₹1.5 Lakh Section 80C limit.
      - Section 80CCD(2): Employer contribution to NPS is tax-exempt up to 14% of salary (Basic + DA) for both Government and Private sector employees, allowed under BOTH the Old and New Tax Regimes.`
    },
    {
      id: 'hra',
      title: 'House Rent Allowance (HRA)',
      category: 'Exemptions',
      content: `HRA is a salary component provided to employees living in rented accommodation. You can claim tax exemption on HRA under Section 10(13A) under the Old Tax Regime.
      The exempt amount is the minimum of the following three:
      1. Actual HRA received.
      2. 50% of salary for metro cities (40% for non-metros).
      3. Rent paid minus 10% of salary.
      
      Note: 'Salary' for HRA calculation means Basic + Dearness Allowance.`
    },
    {
      id: 'capital-gains',
      title: 'Capital Gains Tax Rates',
      category: 'Basics',
      content: `Profits from selling capital assets (equity shares, mutual funds, real estate, gold) are taxed as Capital Gains:
      - Short-Term Capital Gains (STCG):
        - Listed Equity/Equity Mutual Funds: Taxed at flat 20% (holding period up to 1 year).
        - Debt Mutual Funds/Other assets: Taxed at your regular income tax slabs.
      - Long-Term Capital Gains (LTCG):
        - Listed Equity/Equity Mutual Funds: Taxed at 12.5% (holding period over 1 year). Gains up to ₹1.25 Lakhs per year are completely tax-exempt.
        - Gold, Real Estate, Unlisted Shares: Taxed at a flat 12.5% without indexation benefits.
        
      Note: Debt mutual funds purchased after April 1, 2023, are always taxed at regular slab rates as short-term gains, regardless of holding duration.`
    },
    {
      id: 'tds',
      title: 'Tax Deducted at Source (TDS)',
      category: 'Basics',
      content: `TDS is a mechanism introduced to collect tax at the source of income generation itself. If you earn a salary, your employer deducts tax before releasing the cash. Similarly, if your FD interest exceeds ₹40,000 (₹50,000 for senior citizens), banks deduct TDS under Section 194A.
      TDS is not your final tax. It is a credit against your tax liability. If your final tax liability is less than total TDS, you can claim a refund.`
    },
    {
      id: 'form16',
      title: 'Understanding Form 16',
      category: 'Documents',
      content: `Form 16 is a salary tax deduction certificate issued by your employer. It acts as primary proof that tax was deducted from your monthly salary and deposited with the government.
      It is split into two parts:
      - Part A: Contains employer details, employee PAN, and a quarter-wise summary of TDS deposited.
      - Part B: Contains the breakdown of gross salary, allowances exempt under Section 10 (HRA, LTA), standard deduction, and deductions under Chapter VI-A.`
    },
    {
      id: 'form26as',
      title: 'Understanding Form 26AS',
      category: 'Documents',
      content: `Form 26AS is your official tax credit ledger. It details all taxes deposited against your PAN during the financial year, including TDS deducted by employers or banks, tax collected at source (TCS) on foreign travel or purchases, advance tax, and self-assessment tax.
      Before submitting your return, always cross-check Form 26AS to confirm that all taxes deducted by others have been successfully credited to your PAN.`
    },
    {
      id: 'ais',
      title: 'Understanding AIS (Annual Info Statement)',
      category: 'Documents',
      content: `The Annual Information Statement (AIS) is a consolidated tax record issued by the Income Tax Department. It tracks all major financial transactions linked to your PAN throughout the financial year.
      This includes savings account interest, FD interest, mutual fund purchases/redemptions, stock trading, credit card bills exceeding limit thresholds, and property transactions. You must verify that your declared return matches the transactions listed in the AIS to prevent notice alerts.`
    },
    {
      id: 'filing-process',
      title: 'Tax Filing Process',
      category: 'Process',
      content: `Filing your Income Tax Return involves four core steps:
      1. Document Collection: Gather Form 16, salary slips, bank interest certificates, and AIS details.
      2. Audit & Reconciliation: Cross-verify Form 16 tax deposits with Form 26AS and check AIS listings for extra income.
      3. Return Selection & Submission: Select the appropriate ITR form, fill in calculations, choose your regime, and submit on the e-filing portal.
      4. E-verification: Complete verification via Aadhaar OTP within 30 days of submission to ensure the return is processed.`
    },
    {
      id: 'required-docs',
      title: 'Required Documents Checklist',
      category: 'Process',
      content: `Before filing, ensure you have gathered:
      - Permanent Account Number (PAN) Card & Aadhaar Card.
      - Form 16 issued by employer.
      - Form 26AS credit ledger.
      - AIS statement.
      - Bank statement interest summaries.
      - Home loan interest certificate (if claiming house property deductions).
      - Insurance premium receipts & investment statements.`
    }
  ];

  // Filtering based on search
  const filteredTopics = topics.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTopicData = topics.find(t => t.id === activeTopic) || topics[0];

  const renderGuideContent = (content) => {
    const lines = content.split('\n');
    const elements = [];
    let currentList = [];
    let currentListType = null; // 'ul' or 'ol'

    const flushList = (key) => {
      if (currentList.length === 0) return null;
      const listClass = "my-5 pl-6 space-y-3 text-sm md:text-[17px] leading-[1.8] text-justify hyphens-auto text-slate-600 dark:text-slate-300";
      const el = currentListType === 'ol' ? (
        <ol key={key} className={`${listClass} list-decimal`}>
          {currentList.map((item, idx) => (
            <li key={idx} className="marker:text-primary-500 marker:font-bold pl-1.5">{item}</li>
          ))}
        </ol>
      ) : (
        <ul key={key} className={`${listClass} list-disc`}>
          {currentList.map((item, idx) => (
            <li key={idx} className="marker:text-primary-500 pl-1.5">{item}</li>
          ))}
        </ul>
      );
      currentList = [];
      currentListType = null;
      return el;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check list closure
      if (currentList.length > 0 && !line.startsWith('- ') && !/^\d+\.\s/.test(line)) {
        elements.push(flushList(`list-${i}`));
      }

      if (!line) {
        continue;
      }

      // Check lists
      if (line.startsWith('- ')) {
        currentList.push(line.substring(2));
        currentListType = 'ul';
      } else if (/^\d+\.\s/.test(line)) {
        currentList.push(line.replace(/^\d+\.\s/, ''));
        currentListType = 'ol';
      } else if (line.startsWith('Note:')) {
        // Render Note inside a premium card callout box
        elements.push(
          <div key={i} className="my-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-xs md:text-sm text-slate-500 dark:text-slate-400 italic">
            <span className="font-bold text-slate-700 dark:text-slate-300 not-italic block mb-1">Key Note:</span>
            {line.substring(5).trim()}
          </div>
        );
      } else {
        // Standard paragraph
        elements.push(
          <p key={i} className="text-sm md:text-[17px] text-slate-600 dark:text-slate-300 leading-[1.8] text-justify hyphens-auto my-5">
            {line}
          </p>
        );
      }
    }

    if (currentList.length > 0) {
      elements.push(flushList('list-end'));
    }

    return elements;
  };

  return (
    <>
      <SEO 
        title="Income Tax Guide - Slabs, Regimes, & Form 16" 
        description="Learn Indian income tax basics, compare Old vs New regime tax slabs, understand Form 16, AIS, Form 26AS, TDS, and deductions with our taxpayer guide."
      />

      {/* Guide Header Banner */}
      <section className="relative py-16 md:py-24 border-b border-slate-200/50 dark:border-slate-900/50 overflow-hidden">
        <div className="absolute top-[10%] right-[10%] -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[120px]" />
        
        <div className="mx-auto max-w-5xl px-4 md:px-8 text-center space-y-6">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Income Tax Education Center
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Beginner-friendly guides on Indian tax regimes, exemptions, TDS credits, and required filing documents.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Search className="h-4.5 w-4.5" />
            </div>
            <input
              type="text"
              className="block w-full border-0 bg-transparent py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white"
              placeholder="Search tax topics (e.g., HRA, 80C)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Main Guide Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Sidebar navigation list */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Guide Topics</span>
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto border border-slate-250/50 dark:border-slate-900 rounded-2xl p-2 bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm">
                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setActiveTopic(topic.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
                        activeTopic === topic.id
                          ? 'bg-gradient-to-r from-primary-500/10 to-indigo-500/5 border-primary-500/20 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {topic.title}
                    </button>
                  ))
                ) : (
                  <p className="p-4 text-xs text-slate-400 italic">No topics match search.</p>
                )}
              </div>

              {/* Quick Checklist Widget */}
              <div className="border border-slate-200 dark:border-slate-800 p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1.5">
                  <CheckSquare className="h-4 w-4 text-green-500" />
                  <span>Filing Checklist</span>
                </span>
                <ul className="space-y-2.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <li className="flex items-center gap-2">
                    <input type="checkbox" readOnly checked className="rounded text-primary-500 pointer-events-none" />
                    <span>Download AIS PDF</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" readOnly checked className="rounded text-primary-500 pointer-events-none" />
                    <span>Confirm 26AS balances</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" readOnly checked className="rounded text-primary-500 pointer-events-none" />
                    <span>Verify HRA limits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" readOnly checked className="rounded text-primary-500 pointer-events-none" />
                    <span>Scan files with TaxReview AI</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Selected Topic Content Panel */}
            <div className="lg:col-span-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 max-w-[850px] w-full flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 gap-2.5">
                  <div className="space-y-1.5">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedTopicData.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/40 dark:border-slate-700/30">Financial Year: 2025–26</span>
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/40 dark:border-slate-700/30">Assessment Year: 2026–27</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-2.5 py-1 rounded-full uppercase tracking-wider self-start">
                    {selectedTopicData.category}
                  </span>
                </div>

                {/* Formatted Content */}
                <div className="space-y-4 mt-6">
                  {renderGuideContent(selectedTopicData.content)}
                </div>

                {/* Special UI tables/charts based on selected topic */}
                {selectedTopicData.id === 'regimes' && (
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Official FY 2025-26 Tax Slab Comparison</span>
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                      <table className="w-full text-[10px] md:text-xs text-left text-slate-500 dark:text-slate-400">
                        <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold">
                          <tr>
                            <th className="p-3">Income Range (₹)</th>
                            <th className="p-3">New Regime Rates</th>
                            <th className="p-3">Old Regime Rates</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          <tr>
                            <td className="p-3">Up to ₹2,50,000</td>
                            <td className="p-3 font-semibold text-green-500">Nil</td>
                            <td className="p-3 font-semibold text-green-500">Nil</td>
                          </tr>
                          <tr>
                            <td className="p-3">₹2,50,001 - ₹4,00,000</td>
                            <td className="p-3 font-semibold text-green-500">Nil</td>
                            <td className="p-3">5%</td>
                          </tr>
                          <tr>
                            <td className="p-3">₹4,00,001 - ₹5,00,000</td>
                            <td className="p-3">5%</td>
                            <td className="p-3">5%</td>
                          </tr>
                          <tr>
                            <td className="p-3">₹5,00,001 - ₹8,00,000</td>
                            <td className="p-3">5%</td>
                            <td className="p-3">20%</td>
                          </tr>
                          <tr>
                            <td className="p-3">₹8,00,001 - ₹10,00,000</td>
                            <td className="p-3">10%</td>
                            <td className="p-3">20%</td>
                          </tr>
                          <tr>
                            <td className="p-3">₹10,00,001 - ₹12,00,000</td>
                            <td className="p-3">10%</td>
                            <td className="p-3 font-bold text-red-500">30%</td>
                          </tr>
                          <tr>
                            <td className="p-3">₹12,00,001 - ₹16,00,000</td>
                            <td className="p-3">15%</td>
                            <td className="p-3 font-bold text-red-500">30%</td>
                          </tr>
                          <tr>
                            <td className="p-3">₹16,00,001 - ₹20,00,000</td>
                            <td className="p-3">20%</td>
                            <td className="p-3 font-bold text-red-500">30%</td>
                          </tr>
                          <tr>
                            <td className="p-3">₹20,00,001 - ₹24,00,000</td>
                            <td className="p-3">25%</td>
                            <td className="p-3 font-bold text-red-500">30%</td>
                          </tr>
                          <tr>
                            <td className="p-3">Above ₹24,00,000</td>
                            <td className="p-3 font-bold text-red-500">30%</td>
                            <td className="p-3 font-bold text-red-500">30%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-3 text-[9px] text-slate-400 itallic leading-relaxed">
                      *Note: Resident individuals with taxable income up to ₹12 Lakhs pay zero income tax in the New Regime due to the Section 87A rebate of up to ₹60,000. In the Old Regime, the rebate applies to incomes up to ₹5 Lakhs (maximum rebate of ₹12,500). Standard deduction of ₹75,000 (New Regime) or ₹50,000 (Old Regime) is deducted before computing taxable income.
                    </p>
                  </div>
                )}
              </div>

              {/* Disclaimer Notice */}
              <div className="mt-8 p-4.5 rounded-2xl bg-amber-500/[0.04] dark:bg-amber-950/10 border border-amber-500/10 dark:border-amber-900/20 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed print:break-inside-avoid">
                <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">Disclaimer Notice:</span>
                Tax rules may change in future Finance Acts. Please verify important financial decisions using the official Income Tax Department website or a qualified tax professional.
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default IncomeTaxGuide;
