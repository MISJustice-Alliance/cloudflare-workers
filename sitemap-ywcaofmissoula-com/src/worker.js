export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Handle sitemap.xml requests (with or without www)
    if (url.pathname === '/sitemap.xml' || url.pathname === '/sitemap') {
      return generateSitemap();
    }
    
    // For all other requests, pass through
    return fetch(request);
  }
};

function generateSitemap() {
  // Base URL for the website
  const baseUrl = 'https://www.ywcaofmissoula.com';
  
  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Sitemap URLs based on the Notion workspace structure
  const urls = [
    // Main page
    { loc: `${baseUrl}/02fa6619890448408af402796e5a1f63`, lastmod: today, priority: '1.0' },
    
    // Who Should Read This & Why
    { loc: `${baseUrl}/Who-Should-Read-This-Why-245ca07db849803fa367fc6b9f953726`, lastmod: today, priority: '0.9' },
    
    // Comprehensive Timeline & Actionable Claims
    { loc: `${baseUrl}/Comprehensive-Timeline-and-Actionable-Claims-in-the-Case-of-Mr-Nuno-2014-2025-22eca07db84980dd8f90e61f5cda2936`, lastmod: today, priority: '0.9' },
    
    // Civil Rights Violations and Related Claims
    { loc: `${baseUrl}/Civil-Rights-Violations-and-Related-Claims-2015-2025-22dca07db8498090b82eddb661890956`, lastmod: today, priority: '0.9' },
    
    // Evidence Related to Civil Rights Violations
    { loc: `${baseUrl}/Evidence-Related-to-Civil-Rights-Violations-of-Mr-Nuno-2015-2025-204ca07db84980df8ca4fb3637134091`, lastmod: today, priority: '0.9' },
    
    // SLAPP Principles
    { loc: `${baseUrl}/SLAPP-Principles-2015-2020-22fca07db84980d6a3eac8320ab04578`, lastmod: today, priority: '0.8' },
    
    // Intentional Infliction of Extreme Psychological Trauma
    { loc: `${baseUrl}/Intentional-Infliction-of-Extreme-Psychological-Trauma-2015-2025-231ca07db84980a8bf5ac9af137a2292`, lastmod: today, priority: '0.8' },
    
    // Washington Legal Cases
    { loc: `${baseUrl}/2015-2016-Seattle-Case-Related-Civil-Rights-Violations-228ca07db84980fca605f7c1d6bcfaa0`, lastmod: today, priority: '0.8' },
    { loc: `${baseUrl}/2015-2017-Ineffective-Assistance-of-Counsel-and-Plea-Withdrawal-in-Washington-State-228ca07db849800f8286c5a114cc082c`, lastmod: today, priority: '0.8' },
    { loc: `${baseUrl}/2020-Washington-Cases-Witness-Intimidation-Coerced-Pleas-and-the-Impossible-Catch-22-Situation-229ca07db8498059aae7d7ae14e0d2da`, lastmod: today, priority: '0.8' },
    
    // Montana Legal Cases
    { loc: `${baseUrl}/Allegations-Against-YWCA-of-Missoula-Board-Member-Detective-Connie-Brueckner-Patterns-of-Abuse-of-228ca07db84980a1a414ea1af1d42902`, lastmod: today, priority: '0.8' },
    { loc: `${baseUrl}/E-Lise-Chard-s-Abuse-and-Manipulation-of-the-Protection-Filing-System-June-2018-261ca07db849808aa540cf4aeedb071c`, lastmod: today, priority: '0.8' },
    { loc: `${baseUrl}/2017-2019-Misdemeanor-Felony-Stalking-Charges-Civil-Rights-Violations-False-Imprisonment-and-P-229ca07db849802bb934d0f071c3ee93`, lastmod: today, priority: '0.8' },
    { loc: `${baseUrl}/2017-2025-Bryan-Tipp-s-Malpractice-Its-Devastating-Impact-on-Civil-Rights-Accountability-229ca07db8498030ae8cf7a110fc6c17`, lastmod: today, priority: '0.8' },
    { loc: `${baseUrl}/Post-Mortem-of-MT-DoJ-POST-Complaint-Dismissal-August-2025-25cca07db849803993c4ccdcfd99f24e`, lastmod: today, priority: '0.8' },
    
    // Police Reports, Court Docs, and Correspondence
    { loc: `${baseUrl}/Seattle-Police-Report-Written-statement-regarding-incident-2016-348587-2016-228ca07db84980388c01fb27ad0994e1`, lastmod: today, priority: '0.7' },
    { loc: `${baseUrl}/Edmonds-Court-Declaration-of-Ineffective-Assistance-2016-228ca07db84980608e5fea94ddcc64a0`, lastmod: today, priority: '0.7' },
    { loc: `${baseUrl}/Seattle-Municipal-Court-Case-613225-Police-Reports-Case-Dismissal-2016-228ca07db84980fd9726eb7db19a9500`, lastmod: today, priority: '0.7' },
    { loc: `${baseUrl}/YWCA-Complaint-Google-Reviews-Other-Victims-of-YWCA-Misconduct-2018-2020-227ca07db8498113b93ce776b820f60b`, lastmod: today, priority: '0.7' },
    { loc: `${baseUrl}/E-Mail-Correspondence-w-Bryan-Tipp-2020-227ca07db84980cd9d49e6d1e0c66cb1`, lastmod: today, priority: '0.7' },
    { loc: `${baseUrl}/Missoula-Stalking-Case-Dismissal-Documents-2020-227ca07db849807f8aecf7049bf76866`, lastmod: today, priority: '0.7' },
    { loc: `${baseUrl}/Threats-Malicious-Harassment-From-YWCA-Associates-2020-2022-231ca07db849804d8296f190322f66a7`, lastmod: today, priority: '0.7' },
    { loc: `${baseUrl}/MT-DoJ-POST-Correspondence-E-Mail-Chain-August-2025-265ca07db849807baf80eba3f953d2db`, lastmod: today, priority: '0.7' },
    { loc: `${baseUrl}/MT-ACLU-Correspondence-August-2025-25dca07db84980d0ac9ac5924ab05900`, lastmod: today, priority: '0.7' },
    
    // Federal Department Complaints
    { loc: `${baseUrl}/Federal-DoJ-Civil-Rights-Division-Filing-658793-SKB-August-2025-260ca07db84980ff8692efafa09cbee3`, lastmod: today, priority: '0.7' },
    
    // Washington State Department Complaints
    { loc: `${baseUrl}/WA-State-Bar-Complaint-Patricia-Fulton-2016-227ca07db849813ab5c7d10fce07fc75`, lastmod: today, priority: '0.7' },
    { loc: `${baseUrl}/WA-State-Dept-of-Health-Complaint-Dr-Marta-Miranda-2016-227ca07db84980338c3ceddbf6468d39`, lastmod: today, priority: '0.7' },
    { loc: `${baseUrl}/Seattle-OPA-Complaint-2016OPA-1167-2016-22eca07db84980e18aded90acf1c4720`, lastmod: today, priority: '0.7' },
    
    // Montana State Department Complaints
    { loc: `${baseUrl}/MT-Bar-Complaint-ODC-No-25-147-Bryan-Tipp-of-Tipp-Colburn-Lockwood-P-C-July-2025-222ca07db8498094b8bcf91fb3466cf1`, lastmod: today, priority: '0.7' },
    { loc: `${baseUrl}/MT-Bar-Complaint-ODC-No-25-147-Supplemental-Submission-1-August-2025-247ca07db84980519b90cef22ff23b73`, lastmod: today, priority: '0.7' },
    { loc: `${baseUrl}/MT-Bar-Complaint-ODC-No-25-147-Supplemental-Submission-2-September-2025-261ca07db84980e08999e9629f521dfd`, lastmod: today, priority: '0.7' },
    { loc: `${baseUrl}/MT-Bar-Complaint-ODC-No-25-147-Supplemental-Submission-3-September-2025-274ca07db8498022ac3cf23887220ca6`, lastmod: today, priority: '0.7' },
    { loc: `${baseUrl}/MT-Bar-Complaint-ODC-No-25-147-Supplemental-Submission-3-1-September-2025-276ca07db849806c88bfd097db628701`, lastmod: today, priority: '0.7' },
    { loc: `${baseUrl}/MT-DoJ-Public-Safety-Officer-Standards-Training-Council-POST-Complaint-August-2025-24dca07db849806f8f87eab279e35538`, lastmod: today, priority: '0.7' },
    
    // First Amendment Violations
    { loc: `${baseUrl}/YWCA-of-Missoula-s-Role-in-First-Amendment-Violations-Against-Mr-Nuno-2018-2025-229ca07db84980b89cd0db29a85e3b0b`, lastmod: today, priority: '0.8' },
    { loc: `${baseUrl}/Full-Analysis-of-First-Amendment-Violations-2017-2025-226ca07db84980f78c47eef363025a94`, lastmod: today, priority: '0.8' },
    
    // Fourth Amendment Violations
    { loc: `${baseUrl}/Fourth-Amendment-Violations-in-2016OPA-1167-Police-Report-Falsification-and-Unconstitutional-Custod-228ca07db849802884f6c5f7bffd1840`, lastmod: today, priority: '0.8' },
    { loc: `${baseUrl}/Unlawful-Arrest-False-Imprisonment-Lost-in-Missoula-County-Jail-August-2018-226ca07db84980c693bada461462cbdc`, lastmod: today, priority: '0.8' },
    { loc: `${baseUrl}/Fishing-Expedition-via-Facebook-Account-Data-Dump-Search-Warrant-2018-229ca07db84980c69781e8c63a15effb`, lastmod: today, priority: '0.8' },
    { loc: `${baseUrl}/Full-Analysis-of-Fourth-Amendment-Violations-Against-Mr-Nuno-2015-2025-226ca07db84980d5b570e9cc94366540`, lastmod: today, priority: '0.8' },
    
    // Fifth Amendment Violations
    { loc: `${baseUrl}/Full-Analysis-of-Fifth-Amendment-Due-Process-Violations-2015-2025-228ca07db84980c08ac8e4ee2b4f59cb`, lastmod: today, priority: '0.8' },
    
    // Eighth Amendment Violations
    { loc: `${baseUrl}/Full-Analysis-of-Eighth-Amendment-Violations-and-Systematic-Prosecutorial-Abuse-2015-2025-228ca07db84980c9b2b2e6462c6d755f`, lastmod: today, priority: '0.8' },
    
    // Fourteenth Amendment Violations
    { loc: `${baseUrl}/Full-Analysis-of-Fourteenth-Amendment-Equal-Protection-and-Due-Process-Violations-2015-2025-228ca07db84980398376efc89b7b92a5`, lastmod: today, priority: '0.8' },
    
    // Job Discrimination & On-Going Damages
    { loc: `${baseUrl}/Wrongful-Termination-ADA-Violation-Mr-Nuno-v-LoudFeed-July-2025-23eca07db84980b29783d860263bb04e`, lastmod: today, priority: '0.7' },
    
    // Editorial Content
    { loc: `${baseUrl}/Remembering-When-MPD-County-Prosecutors-and-the-YWCA-Allowed-Missoula-to-Become-the-Sexual-Assau-25aca07db84980d680bcfc7002902b1d`, lastmod: today, priority: '0.6' }
  ];

  // Generate properly formatted XML sitemap
  const urlEntries = urls.map(url => 
    `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <priority>${url.priority}</priority>
  </url>`
  ).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Sitemap-URLs': urls.length.toString()
    }
  });
}

// Helper function to escape XML special characters
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
