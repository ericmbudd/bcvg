// 2026 guide body sections, built from the 2026 sample ballot (source of truth):
// 2026/2026 Boulder Colorado Voter Guide Sample Ballot.md
// Ballot question quotes are verbatim from the sample ballot.
// Recommendations are TBD until decided; replace ": TBD" in headings when ready.

module.exports = [
  { kind: 'h2', text: 'Federal, State & County Candidates' },

  { kind: 'h3', text: 'Federal Offices' },
  { kind: 'h4', text: 'United States Senator' },
  { kind: 'names', prefix: 'On the ballot (Vote for One): ', names: ['Mark Baisley', 'John Hickenlooper', 'Bob Chew', 'Christopher Baum', 'Blake Huber', 'Adam Withrow'], suffix: '.' },
  { kind: 'h4', text: 'Representative to the 120th United States Congress - District 2 (Vote for One)' },
  { kind: 'names', prefix: 'On the ballot: ', names: ['Joe Neguse', 'Kelley Anne Dennison', 'Gaylon Kent'], suffix: '.' },

  { kind: 'h3', text: 'State Offices' },
  { kind: 'h4', text: 'Governor/Lieutenant Governor (Vote for One Pair)' },
  { kind: 'names', prefix: 'On the ballot: ', names: ['Victor Marx / George Washington Markert', 'Phil Weiser / Lesley Dahlkemper', 'Stephen T. Hamilton / James K Treibert', 'Eric Mulder / Wayne Harlos', 'Jeff Peckman / T.J. Cole', 'Erik Underwood / Frank Atwood', 'Greg Lopez / Taralyn Romero'], suffix: '.' },
  { kind: 'sources', items: [
    { label: 'Colorado Gubernatorial Candidate: Democrat Phil Weiser', url: 'https://www.cpr.org/2026/09/25/vg-2026-phil-weiser-voter-guide/', tail: 'CPR News' },
    { label: "Phil Weiser's role starting a CU tech hub offers a window into the gubernatorial candidate's approach", url: 'https://www.denverpost.com/2026/09/13/phil-weiser-governor-race-university-colorado/', tail: 'Denver Post' },
    { label: 'Phil Weiser names Lesley Dahlkemper as his running mate', url: 'https://www.cpr.org/2026/07/22/lesley-dahlkemper-phil-weiser-running-mate/', tail: 'CPR News' },
    { label: 'Governor of Colorado, 2026', url: 'https://richardvalenty.com/2026/09/governor-of-colorado-2026/', tail: 'Richard Valenty' }
  ] },
  { kind: 'h4', text: 'Secretary of State' },
  { kind: 'names', prefix: 'On the ballot (Vote for One): ', names: ['Amanda Gonzalez', 'James Wiley', 'Sean Vadney', 'Amanda Campbell', 'Celeste Landry'], suffix: '.' },
  { kind: 'sources', items: [
    { label: 'Colorado Secretary of State: Democrat Amanda Gonzalez', url: 'https://www.cpr.org/2026/09/25/vg-2026-amanda-gonzalez-voter-guide/', tail: 'CPR News' },
    { label: 'Democratic secretary of state candidate points to legal expertise, clerk experience in bid for office', url: 'https://www.cpr.org/2026/09/16/democratic-secretary-of-state-candidate-amanda-gonzalez/', tail: 'CPR News' },
    { label: 'Colorado Secretary of State', url: 'https://richardvalenty.com/2026/09/colorado-secretary-of-state/', tail: 'Richard Valenty' }
  ] },
  { kind: 'h4', text: 'State Treasurer' },
  { kind: 'names', prefix: 'On the ballot (Vote for One): ', names: ['Jeff Bridges', 'Kevin Grantham', 'Jodie Barr', 'Marilee Langner Sturgis'], suffix: '.' },
  { kind: 'sources', items: [
    { label: 'Colorado Treasurer: Democrat Jeff Bridges', url: 'https://www.cpr.org/2026/09/25/vg-2026-jeff-bridges-voter-guide/', tail: 'CPR News' },
    { label: 'Colorado Treasurer race is battle over how state should invest and safeguard its revenues', url: 'https://www.coloradopolitics.com/2026/09/14/colorado-treasurer-race-is-battle-over-how-state-should-invest-and-safeguard-its-revenues-3/', tail: 'Colorado Politics' },
    { label: 'Colorado State Treasurer', url: 'https://richardvalenty.com/2026/09/colorado-state-treasurer-2/', tail: 'Richard Valenty' }
  ] },
  { kind: 'h4', text: 'Attorney General' },
  { kind: 'names', prefix: 'On the ballot (Vote for One): ', names: ['Michael J. Allen', 'Jena Griswold'], suffix: '.' },
  { kind: 'sources', items: [
    { label: 'Colorado Attorney General: Democrat Jena Griswold', url: 'https://www.cpr.org/2026/09/25/vg-2026-jena-griswold-voter-guide/', tail: 'CPR News' },
    { label: "Who's running for Colorado attorney general? A look at the Democratic and Republican primary candidates.", url: 'https://www.denverpost.com/2026/06/11/colorado-primary-candidates-attorney-general/', tail: 'Denver Post' },
    { label: 'Colorado Attorney General', url: 'https://richardvalenty.com/2026/09/colorado-attorney-general-2/', tail: 'Richard Valenty' }
  ] },
  { kind: 'h4', text: 'Regent of the University of Colorado - Congressional District 2' },
  { kind: 'names', prefix: 'On the ballot (Vote for One): ', names: ['Marty Neilson', 'Edie Hooton', 'Richard Friend'], suffix: '.' },
  { kind: 'sources', items: [
    { label: 'Reddit controversy leads to CU regent campaign shakeup for candidate Edie Hooton', url: 'https://www.denverpost.com/2026/06/18/cu-regent-reddit-hooton-boulder/', tail: 'Denver Post' },
    { label: 'Boulder CU regent race sees endorsement switch, apology after Reddit controversy', url: 'https://boulderreportinglab.org/2026/06/28/boulder-cu-regent-race-sees-endorsement-switch-apology-after-reddit-controversy/', tail: 'Boulder Reporting Lab' },
    { label: 'Boulder County election results: Edie Hooton wins CU regent primary; Rachel Friend wins treasurer race', url: 'https://boulderreportinglab.org/2026/07/01/boulder-county-election-results-edie-hooton-wins-cu-regent-primary-rachel-friend-leads-treasurer-race/', tail: 'Boulder Reporting Lab' }
  ] },
  { kind: 'h4', text: 'State Representative - District 10' },
  { kind: 'names', prefix: 'On the ballot: ', names: ['Junie Joseph'], suffix: ' (unopposed).' },
  { kind: 'sources', items: [
    { label: 'Hair products laced with cancer-causing chemicals would come with a warning label under new Colorado bill', url: 'https://coloradosun.com/2026/03/12/house-bill-1135-hair-products-cancer-causing-chemicals-warning-label/', tail: 'Colorado Sun' }
  ] },
  { kind: 'h4', text: 'Regional Transportation District Director - District O' },
  { kind: 'names', prefix: 'On the ballot (Vote for One): ', names: ['Jack Rosenthal', 'Audrey DeBarros'], suffix: '.' },
  { kind: 'html', html: `<div id="yt-rtd-forum" style="position:relative;width:100%;max-width:720px;margin:1.5em auto;padding-bottom:56.25%;background:#000;cursor:pointer;overflow:hidden" data-video-id="oZ27AVUmBDc">
<img src="https://i.ytimg.com/vi/oZ27AVUmBDc/maxresdefault.jpg" alt="RTD District O candidate forum video" loading="lazy" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover">
<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:68px;height:48px;background:rgba(33,33,33,.8);border-radius:12px;display:flex;align-items:center;justify-content:center"><svg width="68" height="48" viewBox="0 0 68 48"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"></path><path d="M45 24 27 14v20" fill="#fff"></path></svg></div>
<p style="position:absolute;bottom:0;left:0;right:0;box-sizing:border-box;margin:0;padding:6px 10px;background:rgba(0,0,0,.6);color:#fff;font-size:13px">July 27, 2026 RTD District O candidate forum — presented by Community Cycles and Better Boulder</p>
</div>
<script>
(function(){
var el=document.getElementById('yt-rtd-forum');
if(!el||el.dataset.ready){return}
el.dataset.ready='1';
el.addEventListener('click',function(){
var f=document.createElement('iframe');
f.src='https://www.youtube.com/embed/oZ27AVUmBDc';
f.title='July 27, 2026 RTD District O candidate forum';
f.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
f.setAttribute('allowfullscreen','');
f.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;border:0';
el.textContent='';
el.appendChild(f);
});
})();
</script>` },
  { kind: 'sources', items: [
    { label: 'RTD Board voter guide', url: 'https://denverite.com/2026/09/25/vg-2026-rtd-board-voter-guide/', tail: 'Denverite' },
    { label: 'Jack Rosenthal RTD Board District O voter guide', url: 'https://denverite.com/2026/09/25/vg-2026-jack-rosenthal-rtd-board-district-o-voter-guide/', tail: 'Denverite' },
    { label: 'Audrey DeBarros RTD Board District O voter guide', url: 'https://denverite.com/2026/09/25/vg-2026-audrey-debarros-rtd-board-district-o-voter-guide/', tail: 'Denverite' },
    { label: 'Jack Rosenthal candidate profile', url: 'https://directory.runforsomething.net/candidate/f09896e36773b5988f3fe58039ca89b3/rosenthal-jack/', tail: 'Run for Something' },
    { label: "Audrey DeBarros has the experience RTD Board needs; Trump's judgment; vote Democrat (Letters)", url: 'https://www.dailycamera.com/2026/09/23/audrey-debarros-has-the-experience-rtd-board-needs-trumps-judgment-vote-democrat-letters/', tail: 'Daily Camera (opinion)' },
    { label: "Boulder doesn't need fiber internet; Audrey DeBarros for RTD board; time for action on climate change (Letters)", url: 'https://www.dailycamera.com/2026/09/06/boulder-doesnt-need-fiber-internet-audrey-debarros-for-rtd-board-time-for-action-on-climate-change-letters/', tail: 'Daily Camera (opinion)' }
  ] },

  { kind: 'h3', text: 'County Offices' },
  { kind: 'h4', text: 'Boulder County Commissioner - District 3' },
  { kind: 'names', prefix: 'On the ballot: ', names: ['Ashley Stolzmann'], suffix: ' (unopposed).' },
  { kind: 'h4', text: 'Boulder County Clerk and Recorder' },
  { kind: 'names', prefix: 'On the ballot: ', names: ['Molly Fitzpatrick'], suffix: ' (unopposed).' },
  { kind: 'h4', text: 'Boulder County Treasurer' },
  { kind: 'names', prefix: 'On the ballot: ', names: ['Rachel Friend'], suffix: ' (unopposed).' },
  { kind: 'h4', text: 'Boulder County Assessor' },
  { kind: 'names', prefix: 'On the ballot: ', names: ['Cynthia Braddock'], suffix: ' (unopposed).' },
  { kind: 'h4', text: 'Boulder County Sheriff' },
  { kind: 'names', prefix: 'On the ballot: ', names: ['Curtis Johnson'], suffix: ' (unopposed).' },
  { kind: 'h4', text: 'Boulder County Surveyor' },
  { kind: 'names', prefix: 'On the ballot: ', names: ['Kayce D. W. Keane'], suffix: ' (unopposed).' },
  { kind: 'h4', text: 'Boulder County Coroner' },
  { kind: 'names', prefix: 'On the ballot: ', names: ['Jeff Martin'], suffix: ' (unopposed).' },
  { kind: 'sources', items: [
    { label: '2026 Election Information', url: 'https://www.bouldercounty.gov/elections/', tail: 'Boulder County (official)' },
    { label: '2026 Boulder County election coverage', url: 'https://boulderreportinglab.org/category/2026-election/', tail: 'Boulder Reporting Lab' },
    { label: '2026 voter guide', url: 'https://www.lwvbc.org/content.aspx?page_id=22&club_id=629866&module_id=753738', tail: 'League of Women Voters of Boulder County' },
    { label: '2026 Boulder County Candidates', url: 'https://richardvalenty.com/2026/09/2026-boulder-county-candidates/', tail: 'Richard Valenty' },
    { label: 'Boulder County election results: Edie Hooton wins CU regent primary; Rachel Friend wins treasurer race', url: 'https://boulderreportinglab.org/2026/07/01/boulder-county-election-results-edie-hooton-wins-cu-regent-primary-rachel-friend-leads-treasurer-race/', tail: 'Boulder Reporting Lab' },
    { label: 'Boulder County election results: Live updates on CU regent, treasurer and Colorado races', url: 'https://boulderreportinglab.org/2026/06/30/boulder-county-election-results-live-updates-on-cu-regent-treasurer-and-colorado-races/', tail: 'Boulder Reporting Lab' }
  ] },

  { kind: 'h2', text: 'City of Boulder Offices' },
  { kind: 'h3', text: 'City of Boulder Mayoral Candidates' },
  { kind: 'names', prefix: 'Ranked-choice voting — rank up to six candidates, one to be elected. On the ballot: ', names: ['Lisa Ann Jacobs', 'Taishya Adams', 'Aaron Brockett', 'Jameson (Jamo) Goldstein', 'Grateful Fred Instead', 'Aquiles La Grave'], suffix: '.' },
  { kind: 'sources', items: [
    { label: '2026 Municipal Election Information', url: 'https://bouldercolorado.gov/services/voting-and-election-information', tail: 'City of Boulder (official)' },
    { label: '2026 Boulder mayoral race coverage', url: 'https://boulderreportinglab.org/tag/boulder-mayor/', tail: 'Boulder Reporting Lab' },
    { label: 'Meet the 19 candidates running for Boulder mayor and City Council in 2026', url: 'https://boulderreportinglab.org/2026/08/30/meet-the-19-candidates-running-for-boulder-mayor-and-city-council-in-2026/', tail: 'Boulder Reporting Lab' },
    { label: 'Meet (most of) the people running for Boulder City Council and mayor', url: 'https://www.dailycamera.com/2026/08/27/boulder-city-council-candidates-issues/', tail: 'Daily Camera' },
    { label: 'Two More Mayoral Candidates', url: 'https://richardvalenty.com/2026/09/two-more-mayoral-candidates/', tail: 'Richard Valenty' },
    { label: "Adams: We're in Polycrisis Mode", url: 'https://richardvalenty.com/2026/09/adams-were-in-polycrisis-mode/', tail: 'Richard Valenty' },
    { label: 'Taishya Adams candidate profile', url: 'https://boulderreportinglab.org/govpack_profiles/taishya-adams-2/', tail: 'Boulder Reporting Lab' },
    { label: 'Brockett: Wants to Finish Strong', url: 'https://richardvalenty.com/2026/09/brockett-wants-to-finish-strong/', tail: 'Richard Valenty' },
    { label: 'Aaron Brockett candidate profile', url: 'https://boulderreportinglab.org/govpack_profiles/aaron-brockett-2/', tail: 'Boulder Reporting Lab' },
    { label: "Meet the CU Boulder student running to be city's next mayor", url: 'https://www.dailycamera.com/2026/09/18/jameson-jamo-goldstein-cu-boulder-mayor/', tail: 'Daily Camera' },
    { label: '“Jamo” Goldstein: Careful with that Credit Card, Boulder', url: 'https://richardvalenty.com/2026/09/jamo-goldstein-careful-with-that-credit-card-boulder/', tail: 'Richard Valenty' },
    { label: 'Jameson (Jamo) Goldstein candidate profile', url: 'https://boulderreportinglab.org/govpack_profiles/jamo-goldstein/', tail: 'Boulder Reporting Lab' },
    { label: 'Grateful Fred Instead candidate profile', url: 'https://boulderreportinglab.org/govpack_profiles/fred-smith/', tail: 'Boulder Reporting Lab' },
    { label: 'Boulder clerk absolves mayoral candidate of most allegations', url: 'https://www.dailycamera.com/2026/09/21/aquiles-la-grave-boulder-mayor-campaign/', tail: 'Daily Camera' },
    { label: 'La Grave: Re-envision the Role of the Mayor', url: 'https://richardvalenty.com/2026/09/la-grave-re-envision-the-role-of-the-mayor/', tail: 'Richard Valenty' },
    { label: 'Aquiles La Grave candidate profile', url: 'https://boulderreportinglab.org/govpack_profiles/aquiles-la-grave/', tail: 'Boulder Reporting Lab' }
  ] },
  { kind: 'h3', text: 'City of Boulder Council Candidates' },
  { kind: 'names', prefix: 'You may vote for up to five candidates. On the ballot: ', names: ['Lee Gilbert', 'Sam Fuqua', 'Ryan Schuchard', 'Jamillah Richmond', 'Benita Duran', 'Tara Winer', 'Rachel Rose Isaacson', 'Dave Martus', 'Scott Rendleman', 'Jill Adler Grano', 'Ryan Jamieson', 'Lynn Segal', 'Tina Marquis'], suffix: '.' },
  { kind: 'sources', items: [
    { label: '2026 Council Candidate Listings', url: 'https://bouldercolorado.gov/2026-city-boulder-mayoral-and-city-council-candidates', tail: 'City of Boulder (official)' },
    { label: '2026 Boulder City Council race coverage', url: 'https://boulderreportinglab.org/tag/boulder-city-council/', tail: 'Boulder Reporting Lab' },
    { label: 'Meet the 19 candidates running for Boulder mayor and City Council in 2026', url: 'https://boulderreportinglab.org/2026/08/30/meet-the-19-candidates-running-for-boulder-mayor-and-city-council-in-2026/', tail: 'Boulder Reporting Lab' },
    { label: 'Sam Fuqua running for Boulder City Council', url: 'https://www.dailycamera.com/2026/09/04/sam-fuqua-boulder-city-council/', tail: 'Daily Camera' },
    { label: "Fuqua: Pay His Family's Boulder Opportunities Forward", url: 'https://richardvalenty.com/2026/09/fuqua-pay-his-familys-boulder-opportunities-forward/', tail: 'Richard Valenty' },
    { label: 'Sam Fuqua candidate profile', url: 'https://boulderreportinglab.org/govpack_profiles/sam-fuqua/', tail: 'Boulder Reporting Lab' },
    { label: "Grano: Re-localize Boulder's Economy", url: 'https://richardvalenty.com/2026/09/grano-re-localize-boulders-economy/', tail: 'Richard Valenty' },
    { label: 'Jill Adler Grano candidate profile', url: 'https://boulderreportinglab.org/govpack_profiles/jill-grano/', tail: 'Boulder Reporting Lab' },
    { label: 'Isaacson: Can Working Class Boulderites Stay Here?', url: 'https://richardvalenty.com/2026/09/isaacson-can-working-class-boulderites-stay-here/', tail: 'Richard Valenty' },
    { label: 'Rachel Rose Isaacson candidate profile', url: 'https://boulderreportinglab.org/govpack_profiles/rachel-rose-isaacson-2/', tail: 'Boulder Reporting Lab' },
    { label: 'Marquis: Can Boulder Housing Be Family-Friendly?', url: 'https://richardvalenty.com/2026/09/marquis-can-boulder-housing-be-family-friendly/', tail: 'Richard Valenty' },
    { label: 'Tina Marquis candidate profile', url: 'https://boulderreportinglab.org/govpack_profiles/tina-marquis-2/', tail: 'Boulder Reporting Lab' },
    { label: 'Boulder Progressives Announces 2026 Ballot Measure Positions, Endorses Jamillah Richmond for Boulder City Council', url: 'https://yellowscene.com/2026/09/20/boulder-progressives-announces-2026-ballot-measure-positions-endorses-jamillah-richmond-for-boulder-city-council/', tail: 'Yellow Scene Magazine' },
    { label: 'Jamillah Richmond candidate profile', url: 'https://boulderreportinglab.org/govpack_profiles/jamillah-richmond/', tail: 'Boulder Reporting Lab' },
    { label: 'Boulder City Councilmember Ryan Schuchard running for re-election', url: 'https://www.dailycamera.com/2026/09/08/ryan-schuchard-boulder-city-council-election/', tail: 'Daily Camera' },
    { label: 'Schuchard: Boulder Government Needs Great Customer Service', url: 'https://richardvalenty.com/2026/09/schuchard-boulder-government-needs-great-customer-service/', tail: 'Richard Valenty' },
    { label: 'Ryan Schuchard candidate profile', url: 'https://boulderreportinglab.org/govpack_profiles/ryan-schuchard-2/', tail: 'Boulder Reporting Lab' },
    { label: 'Tara Winer eyeing re-election to Boulder City Council', url: 'https://www.dailycamera.com/2026/09/10/tara-winer-boulder-city-council-election/', tail: 'Daily Camera' },
    { label: 'Winer: Problem-Solver Seeks Four More Years', url: 'https://richardvalenty.com/2026/09/winer-problem-solver-seeks-four-more-years/', tail: 'Richard Valenty' },
    { label: 'Tara Winer candidate profile', url: 'https://boulderreportinglab.org/govpack_profiles/tara-winer-2/', tail: 'Boulder Reporting Lab' }
  ] },

  { kind: 'h2', text: 'Judicial Retention Questions' },
  { kind: 'h3', text: 'Colorado Supreme Court Justice' },
  { kind: 'names', prefix: 'On the ballot: ', names: [{ text: 'Justice William W. Hood, III', url: 'https://judicialperformance.colorado.gov/hood-iii-william-w-2026-evaluation' }], suffix: ' — vote YES or NO on retention.' },
  { kind: 'h3', text: 'Colorado Court of Appeals Judge' },
  { kind: 'names', prefix: 'On the ballot: ', names: [{ text: 'Judge Rebecca Rankin Freyre', url: 'https://judicialperformance.colorado.gov/freyre-rebecca-r-2026-evaluation' }, { text: 'Judge Elizabeth L. Harris', url: 'https://judicialperformance.colorado.gov/harris-elizabeth-l-2026-evaluation' }, { text: 'Judge Katharine E. Lum', url: 'https://judicialperformance.colorado.gov/lum-katherine-e-2026-evaluation' }, { text: 'Judge Pax Moultrie', url: 'https://judicialperformance.colorado.gov/moultrie-pax-l-2026-evaluation' }, { text: 'Judge Karl L. Schock', url: 'https://judicialperformance.colorado.gov/schock-karl-l-2026-evaluation' }, { text: 'Judge Grant Sullivan', url: 'https://judicialperformance.colorado.gov/sullivan-grant-t-2026-evaluation' }], suffix: ' — vote YES or NO on each retention.' },
  { kind: 'h3', text: 'District Court Judge - 20th Judicial District' },
  { kind: 'names', prefix: 'On the ballot: ', names: [{ text: 'Judge Michael Kotlarczyk', url: 'https://judicialperformance.colorado.gov/kotlarczyk-michael-t-2026-evaluation' }, { text: 'Judge J. Chris Larson', url: 'https://judicialperformance.colorado.gov/larson-j-chris-2026-evaluation' }, { text: 'Judge Nancy Woodruff Salomone', url: 'https://judicialperformance.colorado.gov/salomone-nancy-w-2026-evaluation' }], suffix: ' — vote YES or NO on each retention.' },
  { kind: 'h3', text: 'County Court Judge - Boulder' },
  { kind: 'names', prefix: 'On the ballot: ', names: [{ text: 'Judge Elizabeth House Moulton Brodsky', url: 'https://judicialperformance.colorado.gov/brodsky-elizabeth-house-moulton-2026-evaluation' }, { text: 'Judge Monica Haenselman', url: 'https://judicialperformance.colorado.gov/haenselman-monica-2026-evaluation' }, { text: 'Judge Zachary Ilya Malkinson', url: 'https://judicialperformance.colorado.gov/malkinson-zachary-i-2026-evaluation' }], suffix: ' — vote YES or NO on each retention.' },
  { kind: 'sources', items: [
    { label: '2026 evaluation results', url: 'https://judicialperformance.colorado.gov/know-your-judges/2026-judicial-performance-evaluations', tail: 'Judicial Performance Commission of Colorado (official)' }
  ] },

  { kind: 'h2', text: 'State Ballot Measures' },
  { kind: 'sources', items: [
    { label: '2026 State Ballot Information Booklet (Blue Book)', url: 'https://content.leg.colorado.gov/publications/2026-statewide-ballot-information-booklet', tail: 'Colorado Legislative Council (official)' },
    { label: 'Certified 2026 statewide ballot measures', url: 'https://www.coloradosos.gov/pubs/elections/Initiatives/ballot/contacts/2026.html', tail: 'Colorado Secretary of State (official)' },
    { label: '2026 General Election ballot certification news release', url: 'https://www.coloradosos.gov/pubs/newsRoom/pressReleases/2026/PR20260904BallotCertification.html', tail: 'Colorado Secretary of State (official)' },
    { label: "14 measures will appear on Colorado's statewide ballot in 2026", url: 'https://coloradonewsline.com/2026/09/08/14-measures-will-appear-on-colorados-statewide-ballot-in-2026/', tail: 'Colorado Newsline' },
    { label: 'Colorado voters put more measures on the ballot this year than in over a century', url: 'https://www.westword.com/news/colorado-voters-put-more-measures-on-the-ballot-this-year-than-in-over-a-century-40933054/', tail: 'Westword' },
    { label: 'Colorado voters face lengthy November ballot with 14 statewide measures', url: 'https://www.cbsnews.com/colorado/news/colorado-november-ballot-measures-election/', tail: 'CBS Colorado' },
    { label: "Rosen's guide to the Colorado ballot measures", url: 'https://www.denvergazette.com/2026/09/25/rosens-guide-to-the-colorado-ballot-measures-mike-rosen/', tail: 'Denver Gazette (opinion)' },
    { label: '2026 Voter Guide', url: 'https://i2i.org/2026-voter-guide/', tail: 'Independence Institute (opinion)' }
  ] },

  { kind: 'h3', text: 'Amendment 81 (CONSTITUTIONAL): TBD' },
  { kind: 'quote', question: 'Shall there be an amendment to the Colorado Constitution requiring law enforcement to notify the department of homeland security when a person is charged with either a violent crime or any crime if the person has a prior felony conviction if law enforcement cannot determine that the person is lawfully present in the United States?' },
  { kind: 'para', text: 'Requires law enforcement to notify the Department of Homeland Security when a person is charged with a violent crime, or is charged with any crime and has a prior felony conviction, if law enforcement cannot determine that the person is lawfully present in the United States.' },
  { kind: 'sources', items: [
    { label: 'Amendment 81: Law Enforcement Communication with Federal Immigration Authorities', url: 'https://bouldercoloradovoterguide.com/content/files/2026/09/amendment-81-law-enforcement-communication-with-federal-immigration-authorities.pdf', tail: 'Colorado Blue Book' },
    { label: 'Certified 2026 statewide ballot measures', url: 'https://www.coloradosos.gov/pubs/elections/Initiatives/ballot/contacts/2026.html', tail: 'Colorado Secretary of State (official)' },
    { label: 'Amendment 81: Requires local law enforcement to communicate with ICE', url: 'https://www.cpr.org/2026/09/25/vg-2026-amendment-81-local-law-enforcement-ice/', tail: 'CPR News' },
    { label: 'Police cooperation with ICE to appear on Colorado ballot', url: 'https://coloradonewsline.com/2026/09/14/police-cooperation-ice-colorado-ballot/', tail: 'Colorado Newsline' },
    { label: "Amendment 81 Puts Colorado's Cooperation With ICE Before Voters", url: 'https://rockymountainvoice.com/2026/09/14/amendment-81-puts-colorados-cooperation-with-ice-before-voters/', tail: 'Rocky Mountain Voice' },
    { label: "PHOTOS: Coloradans Opposed to Pro-ICE Ballot Measure Kick Off 'No on 81' Campaign", url: 'https://coloradotimesrecorder.com/2026/09/photos-coloradans-opposed-to-pro-ice-ballot-measure-kick-off-no-on-81-campaign/81530/', tail: 'Colorado Times Recorder' },
    { label: 'Voters will decide whether to force Colorado police to alert ICE after charging people with questionable immigration status', url: 'https://coloradosun.com/2026/01/23/initiative-95-colorado-ballot-approved/', tail: 'Colorado Sun' },
    { label: "'No' on Amendment 81 and 82; Taishya Adams has conviction; stand with Boulder (Letters)", url: 'https://www.dailycamera.com/2026/09/25/letters-boulder-county-colorado-midterm-election-amendment-vote-no/', tail: 'Daily Camera (opinion)' }
  ] },

  { kind: 'h3', text: 'Amendment 82 (CONSTITUTIONAL): TBD' },
  { kind: 'quote', question: 'Shall there be an amendment to the Colorado Constitution creating new law granting the right for consumers to purchase natural gas for cooking or heating in homes or businesses and for distributors and utilities to sell natural gas to consumers?' },
  { kind: 'para', text: "Establishes a constitutional right for consumers to purchase natural gas for use in homes and businesses and a right for producers, distributors, and utilities to sell natural gas, subject to the measure's terms." },
  { kind: 'sources', items: [
    { label: 'Amendment 82: Constitutional Right to Purchase and Sell Natural Gas', url: 'https://bouldercoloradovoterguide.com/content/files/2026/09/amendment-82-constitutional-right-to-purchase-and-sell-natural-gas.pdf', tail: 'Colorado Blue Book' },
    { label: 'Amendment 82: Constitutional Right to Purchase and Sell Natural Gas', url: 'https://www.cpr.org/2026/09/25/vg-2026-amendment-82-natural-gas-right/', tail: 'CPR News' },
    { label: "'No Pollution in the Constitution': Advocacy groups urge voters to reject natural gas ballot measure", url: 'https://www.cpr.org/2026/09/23/natural-gas-ballot-measure-amendment-b2/', tail: 'CPR News' },
    { label: 'Doctors, Legal Experts, Ratepayers, and Conservation Advocates Call Out Corporate Interests Behind Amendment 82 at Colorado Supreme Court', url: 'https://yellowscene.com/2026/09/24/doctors-legal-experts-ratepayers-and-conservation-advocates-call-out-corporate-interests-behind-amendment-82-at-colorado-supreme-court/', tail: 'Yellow Scene Magazine' },
    { label: 'Pro-Fracking Amendment Spokesman Says Natural Gas Is Cleaner Than Burning Dung', url: 'https://coloradotimesrecorder.com/2026/09/pro-fracking-amendment-spokesman-says-natural-gas-is-cleaner-than-burning-dung/81673/', tail: 'Colorado Times Recorder' },
    { label: 'Colorado voters will decide whether to put "right to natural gas" in state constitution', url: 'https://coloradosun.com/2026/08/06/colorado-right-to-natural-gas-ballot-measure/', tail: 'Colorado Sun' },
    { label: 'Colorado lawmakers race to counter "right to natural gas" ballot measure', url: 'https://coloradosun.com/2026/05/08/colorado-lawmakers-counter-natural-gas-ballot-measure/', tail: 'Colorado Sun' },
    { label: "Ballot measure aims to force local govts to allow gas; National Dems see path to flip Republican-held CO congressional seats; Colorado's statewide e-bike rebates return", url: 'https://kgnu.org/ballot-measure-aims-to-force-local-govts-to-allow-gas-national-dems-see-path-to-flip-republican-held-co-congressional-seats-colorados-statewide-e-bike-rebates-return/', tail: 'KGNU' },
    { label: 'Amendment 82 would create a constitutional right for consumers to purchase natural gas', url: 'https://kgnu.org/amendment-82-would-create-a-constitutional-right-for-consumers-to-purchase-natural-gas/', tail: 'KGNU' },
    { label: 'Why put natural gas in the Constitution over and above all the other energy sources we rely on?', url: 'https://www.denverpost.com/2026/09/21/amendment-82-natural-gas-guarantee-home-heating/', tail: 'Denver Post (opinion)' },
    { label: 'Guest column: Legislators sound alarm over Amendment 82', url: 'https://www.postindependent.com/opinion/guest-column-legislators-sound-alarm-over-amendment-82/', tail: 'Post Independent (opinion)' }
  ] },

  { kind: 'h3', text: 'Amendment 83 (CONSTITUTIONAL): TBD' },
  { kind: 'quote', question: 'Shall there be an amendment to the Colorado Constitution creating a constitutional right to hunt, fish, and harvest fish and wildlife by traditional methods, including all species of fish and wildlife managed by the state except non-game species, endangered species, or any species that is illegal to hunt under federal law, and, in connection therewith, establishing hunting and fishing as the preferred means of managing fish and wildlife populations; and preserving the right of the state to regulate hunting, fishing, and wildlife management if necessary for sound scientific wildlife conservation and management, public safety, or to preserve the future of hunting and fishing opportunities for all species?' },
  { kind: 'para', text: 'Establishes a constitutional right to hunt, fish, and harvest fish and wildlife using traditional methods, and declares hunting and fishing the preferred means of managing fish and wildlife populations, while preserving specified state regulatory authority, private-property rights, and protections for nongame and endangered species. As a constitutional amendment, it requires at least 55% approval.' },
  { kind: 'sources', items: [
    { label: 'Amendment 83: Constitutional Right to Hunt and Fish', url: 'https://bouldercoloradovoterguide.com/content/files/2026/09/amendment-83-constitutional-right-to-hunt-and-fish.pdf', tail: 'Colorado Blue Book' },
    { label: 'Amendment 83: Constitutional right to hunt and fish', url: 'https://www.cpr.org/2026/09/25/vg-2026-amendment-83-right-to-hunt-fish/', tail: 'CPR News' },
    { label: 'Colorado voters will consider Amendment 83 to enshrine hunting rights', url: 'https://www.fox21news.com/news/colorado-voters-will-consider-amendment-83-to-enshrine-hunting-rights/', tail: 'FOX21 News' },
    { label: "Who's behind the amendment that would encode hunting and fishing in the state constitution?", url: 'https://kgnu.org/whos-behind-the-amendment-that-would-encode-hunting-and-fishing-in-the-state-constitution/', tail: 'KGNU' },
    { label: 'Backers of Colorado Hunt and Fish Amendment explain measure, address critics', url: 'https://www.kjct8.com/2026/09/11/backers-colorado-hunt-fish-amendment-explain-measure-address-critics/', tail: 'KJCT8' },
    { label: 'Colorado voters will decide whether to cap income tax rate, put "right to hunt and fish" in state constitution', url: 'https://coloradosun.com/2026/08/20/initiatives-232-and-302-colorado-2026-election/', tail: 'Colorado Sun' },
    { label: "How Colorado's candidates for governor say they would address wolves, hunting, fishing and a rural divide", url: 'https://coloradosun.com/2026/06/24/colorado-governor-wolves-hunting-fishing-wildlife-issue-stances/', tail: 'Colorado Sun' },
    { label: 'Vote no on Amendment 83 to keep hunting and fishing well-regulated', url: 'https://www.denverpost.com/2026/09/24/amendment-83-hunting-fishing-right-constitution/', tail: 'Denver Post (opinion)' },
    { label: "Colorado's wildlife heritage deserves constitutional protection", url: 'https://www.gjsentinel.com/opinion/columns/colorado-s-wildlife-heritage-deserves-constitutional-protection/article_bb1898c1-e0d9-4f8c-808b-f8c94d38086a.html', tail: 'Grand Junction Daily Sentinel (opinion)' }
  ] },

  { kind: 'h3', text: 'Amendment 84 (CONSTITUTIONAL): TBD' },
  { kind: 'quote', question: "Shall there be an amendment to the Colorado Constitution requiring a voter to sign and include the last four digits of their social security number or their Colorado driver's license or identification card number on the outside of their mail ballot for any federal or state election, and, in connection therewith, allowing the voter to correct missing or incorrect information, including with alternative forms of identification; and prohibiting a county clerk and recorder from counting the mail ballot unless the problem is fixed?" },
  { kind: 'para', text: 'Requires a voter returning a mail ballot to sign the envelope and include the last four digits of an eligible Colorado identification number or Social Security number in addition to the signature. A ballot with missing or nonmatching required information would be subject to a cure process and would not be counted until the discrepancy is corrected.' },
  { kind: 'sources', items: [
    { label: 'Amendment 84: Mail Ballot Voter Identification', url: 'https://bouldercoloradovoterguide.com/content/files/2026/09/amendment-84-mail-ballot-voter-identification.pdf', tail: 'Colorado Blue Book' },
    { label: 'Certified 2026 statewide ballot measures', url: 'https://www.coloradosos.gov/pubs/elections/Initiatives/ballot/contacts/2026.html', tail: 'Colorado Secretary of State (official)' },
    { label: 'ID number would have to appear on Colorado mail ballots if amendment passes', url: 'https://coloradonewsline.com/2026/09/23/id-number-colorado-mail-ballots/', tail: 'Colorado Newsline' },
    { label: 'Ohio dark-money group spends $2.2 million to support Colorado measure tightening mail-voting rules', url: 'https://www.denverpost.com/2026/09/19/colorado-amendment-84-ballot-identification-money/', tail: 'Denver Post' },
    { label: 'Issue groups start spending big on attempts to change Colorado laws through the ballot', url: 'https://www.denverpost.com/2026/09/23/colorado-campaign-fundraising-voter-id-fentanyl-tax-ballot/', tail: 'Denver Post' },
    { label: 'Major donors fuel Colorado ballot measure fights across the state', url: 'https://www.coloradopolitics.com/2026/09/25/major-donors-fuel-colorado-ballot-measure-fights-across-the-state/', tail: 'Colorado Politics' },
    { label: "3 fraudulent Colorado ballots were counted in 2024; here's how Amendment 84 could have stopped it", url: 'https://www.dailycamera.com/2026/09/21/fraudulent-colorado-mail-in-ballots-counted-amendment-84-opinion/', tail: 'Daily Camera (opinion)' }
  ] },

  { kind: 'h3', text: 'Amendment 85 (CONSTITUTIONAL): TBD' },
  { kind: 'quote', question: 'Shall there be an amendment to the Colorado Constitution concerning ballot question language, and, in connection therewith, requiring all state and local ballot questions to be written in plain language and at no more than an 8th grade reading level and prohibiting a state statute from requiring language that conflicts with these requirements in ballot questions for citizen-initiated measures?' },
  { kind: 'para', text: 'Requires all state and local ballot questions to be written in plain language at no more than an eighth-grade reading level, and prohibits statutes from mandating language that conflicts with these requirements in ballot titles for citizen-initiated measures.' },
  { kind: 'sources', items: [
    { label: 'Amendment 85: Plain Language Ballot Titles', url: 'https://bouldercoloradovoterguide.com/content/files/2026/09/amendment-85-plain-language-ballot-titles.pdf', tail: 'Colorado Blue Book' },
    { label: 'Aug. 28 qualification announcement (Initiative 234)', url: 'https://www.coloradosos.gov/pubs/newsRoom/pressReleases/2026/PR20260828Initiative234.html', tail: 'Colorado Secretary of State (official)' },
    { label: "Amendment 85: 'Plain Language Ballot Questions'", url: 'https://www.cpr.org/2026/09/25/vg-2026-initiative-234-plain-language-ballot-questions/', tail: 'CPR News' },
    { label: "14 measures will appear on Colorado's statewide ballot in 2026", url: 'https://coloradonewsline.com/2026/09/08/14-measures-will-appear-on-colorados-statewide-ballot-in-2026/', tail: 'Colorado Newsline' },
    { label: 'Colorado voters will decide if ballot measures should be written at an 8th grade reading level', url: 'https://coloradosun.com/2026/08/28/initiative-234-colorado-plain-language-ballot-measures/', tail: 'Colorado Sun' },
    { label: 'ENDORSEMENT: To put it plainly — YES on Amendment 85', url: 'https://gazette.com/2026/09/23/endorsement-to-put-it-plainly-yes-on-amendment-85-5/', tail: 'Colorado Springs Gazette (opinion)' }
  ] },

  { kind: 'h3', text: 'Amendment 86 (CONSTITUTIONAL): TBD' },
  { kind: 'quote', question: 'Shall there be an amendment to the Colorado Constitution concerning congressional redistricting, and, in connection therewith, reenacting the current process for congressional redistricting in the Colorado Constitution and prohibiting modifications to a final map unless at least three public meetings are held, the modifications do not have the effect of dividing communities of interest or purposefully favoring one political party, and are approved by the congressional redistricting commission and the Colorado Supreme Court?' },
  { kind: 'para', text: 'Reenacts the current congressional redistricting process in the Colorado Constitution and imposes requirements on any off-cycle redistricting: a modified map would require at least three public meetings, could not purposefully favor a political party or divide communities of interest, and would need approval by the independent congressional redistricting commission and the Colorado Supreme Court.' },
  { kind: 'sources', items: [
    { label: 'Amendment 86: Requirements for Off-Cycle Congressional Redistricting', url: 'https://bouldercoloradovoterguide.com/content/files/2026/09/amendment-86-requirements-for-off-cycle-congressional-redistricting.pdf', tail: 'Colorado Blue Book' },
    { label: 'Amendment 86: 2025-2026 #256 Congressional Redistricting', url: 'https://www.cpr.org/2026/09/25/vg-2026-amendment-86-redistricting/', tail: 'CPR News' },
    { label: "House Speaker Mike Johnson's PAC pours $250K into Colorado redistricting fight", url: 'https://coloradosun.com/2026/09/21/colorado-redistricting-mike-johnson-support/', tail: 'Colorado Sun' },
    { label: 'Colorado Redistricting Measure Attracts $250K From National GOP PAC', url: 'https://rockymountainvoice.com/2026/09/21/colorado-redistricting-measure-attracts-250k-from-national-gop-pac/', tail: 'Rocky Mountain Voice' },
    { label: 'Signatures submitted in Colorado for initiative that would require approval from an independent commission and the state supreme court for mid-decade redistricting maps', url: 'https://news.ballotpedia.org/2026/07/31/signatures-submitted-in-colorado-for-initiative-that-would-require-approval-from-an-independent-commission-and-the-state-supreme-court-for-mid-decade-redistricting-maps/', tail: 'Ballotpedia News' },
    { label: "EDITORIAL: Am. 86's hedge against gerrymandering", url: 'https://www.denvergazette.com/2026/09/21/editorial-am-86s-hedge-against-gerrymandering/', tail: 'Denver Gazette (opinion)' }
  ] },

  { kind: 'h3', text: 'Amendment 87 (CONSTITUTIONAL): TBD' },
  { kind: 'quote', question: "SHALL STATE TAXES BE INCREASED $2.7 BILLION ANNUALLY, IN ORDER TO INCREASE OR IMPROVE LEVELS OF PUBLIC SERVICES, INCLUDING K-12 PUBLIC SCHOOL EDUCATION, HEALTH CARE, AND EARLY CHILD CARE AND EDUCATION SERVICES, BY AN AMENDMENT TO THE COLORADO CONSTITUTION AND A CHANGE TO THE COLORADO REVISED STATUTES REPEALING EXISTING LAW AND CREATING NEW LAW TO REPLACE THE UNIFORM STATE INCOME TAX RATE WITH A GRADUATED INCOME TAX STRUCTURE, AND, IN CONNECTION THEREWITH, AMENDING THE TAXPAYER'S BILL OF RIGHTS TO ELIMINATE THE CONSTITUTIONAL REQUIREMENT FOR ALL TAXABLE NET INCOME TO BE TAXED AT ONE RATE WITH NO ADDED TAX ON INCOME; ESTABLISHING VARIOUS INCOME TAX RATES BASED ON THE AMOUNT OF TAXABLE INCOME EARNED BY INDIVIDUALS, ESTATES, TRUSTS, AND CORPORATIONS, WHILE MAINTAINING THE CURRENT 4.4% TAX ON INCOME FROM THE SALE OF A PRINCIPAL RESIDENCE, WHICH WILL RESULT IN THE ESTIMATED CHANGE IN INCOME TAXES OWED BY INDIVIDUALS AS IDENTIFIED IN THE FOLLOWING TABLE; AND AUTHORIZING THE STATE TO RETAIN AND SPEND ANY INCREASED REVENUE FROM THE NEW TAX STRUCTURE, AS A VOTER-APPROVED REVENUE CHANGE, TO SUPPLEMENT CURRENT LEVELS OF FUNDING FOR K-12 PUBLIC SCHOOL EDUCATION, HEALTH CARE, AND EARLY CHILD CARE AND EDUCATION PROGRAMS?" },
  { kind: 'para', text: "Replaces Colorado's flat individual income-tax rate with a graduated-rate structure and increases state taxes by an estimated $2.7 billion annually, directing additional revenue to K-12 education, health care, and early child care and education. Conflicts with Proposition 136, which caps the income tax rate at 4.4%; if both pass, Colorado's rules governing conflicting measures would apply." },
  { kind: 'sources', items: [
    { label: 'Amendment 87: Graduated Income Tax', url: 'https://bouldercoloradovoterguide.com/content/files/2026/09/amendment-87-graduated-income-tax.pdf', tail: 'Colorado Blue Book' },
    { label: '2026 Election Calendar (Sept. 2 deadline for Aug. 3 petition sufficiency decisions)', url: 'https://www.sos.state.co.us/pubs/elections/calendars/2026ElectionCalendar.pdf', tail: 'Colorado Secretary of State (official)' },
    { label: 'How the ballot proposal to overhaul Colorado taxes could change your tax bill — and who pays more', url: 'https://www.denverpost.com/2026/09/20/colorado-amendment-87-graduated-income-tax/', tail: 'Denver Post' },
    { label: 'Colorado voters face dueling income tax measures on November ballot', url: 'https://www.9news.com/article/news/politics/elections/colorado-voters-income-tax-measures-november-ballot/73-80d69040-f41b-42db-998f-a8279c414fa2', tail: '9News' },
    { label: 'Calculate how your Colorado income tax bill would change if Amendment 87 passes', url: 'https://coloradosun.com/2026/09/03/colorado-initiative-195-graduated-income-tax-calculator/', tail: 'Colorado Sun' },
    { label: 'Lawsuit seeks to remove Colorado graduated income tax measure from ballot', url: 'https://www.coloradopolitics.com/2026/09/22/graduated-tax-measure-faces-lawsuit-seeking-removal-from-november-ballot/', tail: 'Colorado Politics' },
    { label: 'Big change for Colorado income tax makes ballot, which is now all but set for November', url: 'https://www.denverpost.com/2026/09/01/colorado-graduated-income-tax-ballot-measures/', tail: 'Denver Post' },
    { label: "Backers of Colorado's graduated income tax ballot measure race to collect final voter signatures before Monday", url: 'https://coloradosun.com/2026/08/01/graduated-income-tax-ballot-measure-colorado/', tail: 'Colorado Sun' },
    { label: 'Colorado ballot questions, meant to keep special interests in check, are increasingly created by them', url: 'https://coloradosun.com/2026/08/18/colorado-ballot-questions-are-increasingly-created-by-special-interests/', tail: 'Colorado Sun' },
    { label: 'Graduated income tax proposal is a flat tax in disguise', url: 'https://gazette.com/2026/09/06/graduated-income-tax-proposal-is-a-flat-tax-in-disguise-jon-caldara/', tail: 'Colorado Springs Gazette (opinion)' },
    { label: 'GUEST OPINION: Graduated tax pushes back on growing inequality', url: 'https://www.denvergazette.com/2026/09/20/graduated-tax-pushes-back-on-growing-inequality-opinion/', tail: 'Denver Gazette (opinion)' },
    { label: 'Littwin: Can Coloradans really refuse Amendment 87 and its tax-the-rich, cut-taxes-for-everyone-else promise?', url: 'https://coloradosun.com/2026/09/13/amendment-87-taxes-opinion-littwin/', tail: 'Colorado Sun (opinion)' }
  ] },

  { kind: 'h3', text: 'Proposition NN (STATUTORY): TBD' },
  { kind: 'quote', question: 'Shall state investment in K-12 public education increase two percent each year for the next ten years, with investments used to increase teacher pay, improve teacher retention, lower class sizes, and increase access to career and technical courses, without raising taxes but instead funded by raising the annual limit on state fiscal year spending only by the amount spent on public K-12 education as a voter-approved revenue change, and requiring an annual publicly released, independent audit to show how the new investments are spent?' },
  { kind: 'para', text: 'Increases state investment in K-12 public education by two percent each year for the next ten years for teacher pay, teacher retention, smaller class sizes, and career and technical courses, funded by raising the state fiscal year spending limit only by the amount spent on K-12 education, with an annual independent audit of how the investments are spent.' },
  { kind: 'sources', items: [
    { label: 'Proposition NN: Keep and Spend Money for Education and Other Purposes', url: 'https://bouldercoloradovoterguide.com/content/files/2026/09/proposition-nn-keep-and-spend-money-for-education-and-other-purposes.pdf', tail: 'Colorado Blue Book' },
    { label: 'SB 26-135 (referring legislation)', url: 'https://leg.colorado.gov/bills/sb26-135', tail: 'Colorado General Assembly (official)' },
    { label: 'At Proposition NN campaign launch, advocates hope this time will be different', url: 'https://www.chalkbeat.org/colorado/2026/07/17/advocates-launch-prop-nn-school-funding-yes-campaign/', tail: 'Chalkbeat Colorado' },
    { label: 'Campaign launched to redirect $1 billion in TABOR refunds to education', url: 'https://www.coloradopolitics.com/2026/07/17/campaign-launched-to-redirect-1-billion-in-tabor-refunds-to-education/', tail: 'Colorado Politics' },
    { label: 'Proposition NN: TABOR Revenue Cap Increase for K-12 Education Measure', url: 'https://www.cpr.org/2026/09/25/vg-2026-prop-nn-tabor-school-funding/', tail: 'CPR News' },
    { label: 'Prop NN supporters say the money is guaranteed and K-12 only. The law says otherwise.', url: 'https://rockymountainvoice.com/2026/09/21/prop-nn-supporters-say-the-money-is-guaranteed-and-k-12-only-the-law-says-otherwise/', tail: 'Rocky Mountain Voice' },
    { label: "Littwin: Maybe it's a long shot, but voters will get another chance to rein in TABOR", url: 'https://coloradosun.com/2026/05/13/tabor-taxes-colorado-opinion-littwin/', tail: 'Colorado Sun (opinion)' },
    { label: "Proposition NN is the best investment for Colorado's students and schools", url: 'https://www.coloradopolitics.com/2026/08/07/proposition-nn-is-the-best-investment-for-colorados-students-and-schools-guest-column/', tail: 'Colorado Politics (opinion)' },
    { label: "EDITORIAL: The real 'deepfake' is Proposition NN", url: 'https://www.denvergazette.com/2026/08/26/editorial-the-real-deepfake-is-proposition-nn/', tail: 'Denver Gazette (opinion)' }
  ] },

  { kind: 'h3', text: 'Proposition 132 (STATUTORY): TBD' },
  { kind: 'quote', question: 'Shall there be a change to the Colorado Revised Statutes concerning criminal penalties for fentanyl and certain synthetic opioids, and, in connection therewith, increasing the felony classifications of drug-related crimes for distribution, manufacturing, dispensing, sale, or possession of fentanyl and certain synthetic opioids; creating mandated treatment for certain drug felony violations based on possession amount; and changing sentencing provisions to narrow or eliminate exemptions for crimes related to fentanyl and certain synthetic opioids and drug-related deaths?' },
  { kind: 'para', text: 'Increases criminal penalties for specified fentanyl offenses, requires treatment in specified circumstances, and changes sentencing provisions relating to fentanyl-related deaths.' },
  { kind: 'sources', items: [
    { label: 'Proposition 132: Increase Penalties for Fentanyl Crimes', url: 'https://bouldercoloradovoterguide.com/content/files/2026/09/proposition-132-increase-penalties-for-fentanyl-crimes.pdf', tail: 'Colorado Blue Book' },
    { label: 'Certified 2026 statewide ballot measures', url: 'https://www.coloradosos.gov/pubs/elections/Initiatives/ballot/contacts/2026.html', tail: 'Colorado Secretary of State (official)' },
    { label: 'Proposition 132: Penalties for Fentanyl Crimes', url: 'https://www.cpr.org/2026/09/25/vg-2026-prop-132-increase-fentanyl-penalties/', tail: 'CPR News' },
    { label: 'Aurora lawmakers lean toward public rebuke of tough-on-crime fentanyl Proposition 132', url: 'https://sentinelcolorado.com/metro/aurora-lawmakers-lean-toward-public-rebuke-of-tough-on-crime-fentanyl-proposition-132/', tail: 'Sentinel Colorado' },
    { label: 'La Plata County commissioners oppose measure to increase fentanyl possession sentences', url: 'https://www.durangoherald.com/articles/news/la-plata-county-commissioners-oppose-measure-to-increase-fentanyl-possession-sentences/', tail: 'Durango Herald' },
    { label: 'Campaign fighting proposition that would increase penalties for fentanyl crimes', url: 'https://kdvr.com/news/local/campaign-fighting-proposition-that-would-increase-penalties-for-fentanyl-crimes/', tail: 'KDVR (Fox31)' },
    { label: 'GOP-backed ballot measure would make any fentanyl possession a felony in Colorado', url: 'https://coloradosun.com/2025/11/20/colorado-fentanyl-ballot-measure-2026/', tail: 'Colorado Sun' },
    { label: 'GUEST OPINION: Amid fentanyl epidemic, Prop. 132 will save lives', url: 'https://gazette.com/2026/09/18/guest-opinion-amid-fentanyl-epidemic-prop-132-will-save-lives/', tail: 'Colorado Springs Gazette (opinion)' },
    { label: 'GUEST OPINION: Curbing fentanyl overdoses starts with reducing addiction', url: 'https://www.denvergazette.com/2026/09/10/guest-opinion-curbing-fentanyl-overdoses-starts-with-reducing-addiction/', tail: 'Denver Gazette (opinion)' },
    { label: 'Opinion: Colorado must invest in evidence-based policies to prevent harm from substances, not costly criminalization', url: 'https://coloradosun.com/2025/12/23/opinion-colorado-ballot-initiative-not-helping-addicitions/', tail: 'Colorado Sun (opinion)' }
  ] },

  { kind: 'h3', text: 'Proposition 133 (STATUTORY): TBD' },
  { kind: 'quote', question: 'Shall there be a change to the Colorado Revised Statutes modifying existing law concerning human trafficking of a minor for sexual servitude, and, in connection therewith, creating new law expanding human trafficking of a minor for sexual servitude to include knowingly trading anything of monetary value to buy or sell sexual activity with a minor and increasing the penalty to be life in prison without parole or release?' },
  { kind: 'para', text: 'Expands conduct covered by the offense involving human trafficking of a minor for sexual servitude and increases the penalty to life imprisonment without parole.' },
  { kind: 'sources', items: [
    { label: 'Proposition 133: Penalties for Human Trafficking of a Minor', url: 'https://bouldercoloradovoterguide.com/content/files/2026/09/proposition-133-penalties-for-human-trafficking-of-a-minor.pdf', tail: 'Colorado Blue Book' },
    { label: 'Ballot Proposition 133: Penalties for Human Trafficking of a Minor', url: 'https://www.cpr.org/2026/09/25/vg-2026-prop-133-life-in-prison-trafficking/', tail: 'CPR News' },
    { label: "CSI study reviews impacts of Colorado's mandatory sex-trafficking sentencing measure", url: 'https://gazette.com/2026/08/14/csi-study-reviews-impacts-of-colorados-mandatory-sex-trafficking-sentencing-measure/', tail: 'Colorado Springs Gazette' },
    { label: 'Colorado voters will decide whether to ban trans kids from gendered sports, outlaw gender-affirming surgery for children', url: 'https://coloradosun.com/2026/03/17/transgender-sports-surgery-colorado-ballot-measures-2026/', tail: 'Colorado Sun' },
    { label: "EDITORIAL: Capitol's Dems ignored sex-trafficked kids", url: 'https://www.denvergazette.com/2026/08/25/editorial-capitols-dems-ignored-sex-trafficked-kids/', tail: 'Denver Gazette (opinion)' },
    { label: "ENDORSEMENT: Protect Colorado's children — YES on 133, 134 & 135", url: 'https://www.denvergazette.com/2026/09/25/endorsement-protect-colorados-children-yes-on-133-134-135/', tail: 'Denver Gazette (opinion)' },
    { label: 'Lori Gimelshteyn on 3 ballot measures to let kids be kids | The OpEdge Podcast', url: 'https://www.denvergazette.com/2026/09/09/lori-gimelshteyn-on-3-ballot-measures-to-let-kids-be-kids-the-opedge-podcast/', tail: 'Denver Gazette (opinion)' },
    { label: 'DAVIS: Three Bigoted Ballot Measures', url: 'https://coloradotimesrecorder.com/2026/09/davis-three-bigoted-ballot-measures/81934/', tail: 'Colorado Times Recorder (opinion)' }
  ] },

  { kind: 'h3', text: 'Proposition 134 (STATUTORY): TBD' },
  { kind: 'quote', question: "Shall there be a change to the Colorado Revised Statutes creating new law restricting participation in all K-12 and collegiate school sports based on the participant's sex as determined by certain aspects of their biological reproductive system, and, in connection therewith, requiring a school, institution of higher education, or athletic association to designate each school or intramural athletic team or sport as male, female, or coeducational; only allowing participants to compete on the team or sport of their designated sex or to compete on a coeducational team; creating an exception to allow a female to participate on a male-designated team or sport if there is no female team available; prohibiting a government entity, licensing or accrediting organization, or athletic association from entertaining a complaint, opening an investigation, or taking other adverse action against a school for maintaining separate teams or sports for females; and providing the commissioner of education with the authority to enforce the proposed initiative for K-12 school districts?" },
  { kind: 'para', text: 'Requires covered public and private K-12 and postsecondary schools to classify athletic teams as male, female, or coeducational based on sex and restricts participation on sex-designated teams as specified in the measure.' },
  { kind: 'sources', items: [
    { label: 'Proposition 134: Male and Female Participation in School and Collegiate Sports', url: 'https://bouldercoloradovoterguide.com/content/files/2026/09/proposition-134-male-and-female-participation-in-school-and-collegiate-sports.pdf', tail: 'Colorado Blue Book' },
    { label: 'Ballot Proposition 134: Male and Female Participation in School Sports', url: 'https://www.cpr.org/2026/09/25/vg-2026-prop-134-trans-students-sports/', tail: 'CPR News' },
    { label: 'Few trans students play school sports in Colorado. A 2026 ballot measure would ban them.', url: 'https://coloradonewsline.com/2026/09/22/colorado-ballot-measure-ban-trans-athletes/', tail: 'Colorado Newsline' },
    { label: 'Parents of transgender kids sound the alarm over Colorado ballot measures', url: 'https://www.westword.com/news/parents-of-transgender-kids-sound-the-alarm-over-colorado-ballot-measures-40935167/', tail: 'Westword' },
    { label: 'Coalition says two propositions on November ballot would hurt people with transgender families', url: 'https://kdvr.com/news/local/coalition-says-two-propositions-on-november-ballot-would-hurt-people-with-transgender-families/', tail: 'KDVR (Fox31)' },
    { label: "Complaint targets backers of Colorado's transgender ballot measures", url: 'https://www.coloradopolitics.com/2026/09/22/campaign-finance-complaint-targets-backers-of-transgender-ballot-measures-over-petitions-4/', tail: 'Colorado Politics' },
    { label: 'Two ballot measures focused on transgender youth qualify for November ballot', url: 'https://www.cpr.org/2026/03/17/trans-youth-athlete-gender-care-2026-ballot-measures/', tail: 'CPR News' },
    { label: 'How two Colorado mothers found themselves on opposite sides of the transgender ballot fight', url: 'https://www.cpr.org/2026/04/16/colorado-mothers-pro-and-against-transgender-ballot-initiatives/', tail: 'CPR News' },
    { label: "ENDORSEMENT: Protect Colorado's children — YES on 133, 134 & 135", url: 'https://www.denvergazette.com/2026/09/25/endorsement-protect-colorados-children-yes-on-133-134-135/', tail: 'Denver Gazette (opinion)' }
  ] },

  { kind: 'h3', text: 'Proposition 135 (STATUTORY): TBD' },
  { kind: 'quote', question: "Shall there be a change to the Colorado Revised Statutes modifying existing law by prohibiting surgery on a minor for the purpose of altering the minor's biological sex characteristics, and, in connection therewith, prohibiting any health-care professional or other person from knowingly performing, prescribing, administering, or providing any surgery to a minor for the purpose of altering the minor's biological sex characteristics and prohibiting the use of state or federal funds, Medicaid reimbursement, or insurance coverage to pay for this type of surgery?" },
  { kind: 'para', text: 'Prohibits medical providers from performing specified surgeries on minors when the purpose is to alter sex characteristics, and restricts government funding, Medicaid reimbursement, and insurance coverage for those procedures.' },
  { kind: 'sources', items: [
    { label: 'Proposition 135: Prohibit Surgery on Minors in Response to Perception of Sex or Gender', url: 'https://bouldercoloradovoterguide.com/content/files/2026/09/proposition-135-prohibit-surgery-on-minors-in-response-to-perception-of-sex-or-gender.pdf', tail: 'Colorado Blue Book' },
    { label: 'Proposition 135: Prohibit Certain Surgeries on Minors', url: 'https://www.cpr.org/2026/09/25/vg-2026-prop-135-minor-gender-affirming-surgeries/', tail: 'CPR News' },
    { label: 'Parents of transgender kids sound the alarm over Colorado ballot measures', url: 'https://www.westword.com/news/parents-of-transgender-kids-sound-the-alarm-over-colorado-ballot-measures-40935167/', tail: 'Westword' },
    { label: 'Coalition says two propositions on November ballot would hurt people with transgender families', url: 'https://kdvr.com/news/local/coalition-says-two-propositions-on-november-ballot-would-hurt-people-with-transgender-families/', tail: 'KDVR (Fox31)' },
    { label: "Complaint targets backers of Colorado's transgender ballot measures", url: 'https://www.coloradopolitics.com/2026/09/22/campaign-finance-complaint-targets-backers-of-transgender-ballot-measures-over-petitions-4/', tail: 'Colorado Politics' },
    { label: 'Colorado voters will decide whether to ban trans kids from gendered sports, outlaw gender-affirming surgery for children', url: 'https://coloradosun.com/2026/03/17/transgender-sports-surgery-colorado-ballot-measures-2026/', tail: 'Colorado Sun' },
    { label: 'How two Colorado mothers found themselves on opposite sides of the transgender ballot fight', url: 'https://www.cpr.org/2026/04/16/colorado-mothers-pro-and-against-transgender-ballot-initiatives/', tail: 'CPR News' },
    { label: "A kid's right to bodily integrity at heart of why I'm voting for Prop. 135", url: 'https://www.coloradopolitics.com/2026/09/20/a-kids-right-to-bodily-integrity-at-heart-of-why-im-voting-for-prop-135-jon-caldara/', tail: 'Colorado Politics (opinion)' },
    { label: "ENDORSEMENT: Protect Colorado's children — YES on 133, 134 & 135", url: 'https://www.denvergazette.com/2026/09/25/endorsement-protect-colorados-children-yes-on-133-134-135/', tail: 'Denver Gazette (opinion)' }
  ] },

  { kind: 'h3', text: 'Proposition 136 (STATUTORY): TBD' },
  { kind: 'quote', question: 'Shall there be a change to the Colorado Revised Statutes capping the state income tax rate at 4.4% of federal taxable income for individuals and corporations?' },
  { kind: 'para', text: "Caps the state individual and corporate income-tax rate at 4.4% of federal taxable income. Conflicts with Amendment 87's graduated-rate structure; if both pass, Colorado's rules governing conflicting measures would apply." },
  { kind: 'sources', items: [
    { label: 'Proposition 136: Income Tax Rate Limit', url: 'https://bouldercoloradovoterguide.com/content/files/2026/09/proposition-136-income-tax-rate-limit.pdf', tail: 'Colorado Blue Book' },
    { label: 'Big change for Colorado income tax makes ballot, which is now all but set for November', url: 'https://www.denverpost.com/2026/09/01/colorado-graduated-income-tax-ballot-measures/', tail: 'Denver Post' },
    { label: 'Colorado graduated income tax proposal qualifies for 2026 ballot', url: 'https://coloradonewsline.com/2026/09/01/colorado-graduated-income-tax/', tail: 'Colorado Newsline' },
    { label: 'Voters to decide fate of state taxes this fall', url: 'https://coloradonewsline.com/2026/09/24/repub/voters-decide-fate-of-state-taxes/', tail: 'Colorado Newsline' },
    { label: 'Colorado voters will decide whether to cap income tax rate, put "right to hunt and fish" in state constitution', url: 'https://coloradosun.com/2026/08/20/initiatives-232-and-302-colorado-2026-election/', tail: 'Colorado Sun' },
    { label: 'Littwin: Can Coloradans really refuse Amendment 87 and its tax-the-rich, cut-taxes-for-everyone-else promise?', url: 'https://coloradosun.com/2026/09/13/amendment-87-taxes-opinion-littwin/', tail: 'Colorado Sun (opinion)' },
    { label: 'This secretive group warps democracy in Colorado', url: 'https://coloradonewsline.com/2026/09/17/warp-democracy-in-colorado/', tail: 'Colorado Newsline (opinion)' },
    { label: 'The little-known names behind the raft of ballot issues', url: 'https://www.denvergazette.com/2026/09/22/the-little-known-names-behind-the-raft-of-ballot-issues-eric-sondermann/', tail: 'Denver Gazette (opinion)' }
  ] },

  { kind: 'h3', text: 'Proposition 137 (STATUTORY): TBD' },
  { kind: 'quote', question: "Shall there be a change to the Colorado Revised Statutes creating new law to increase water and land conservation funding without raising taxes, and, in connection therewith, through a voter-approved revenue change, allowing the state to keep and spend a portion of revenue from the state sales tax on sporting goods and equipment to conserve and protect Colorado's water, land, and forests, prevent wildfires, support outdoor recreation training and activities, and reduce revenue spent on these conservation purposes if necessary to preserve funding for certain tax credits?" },
  { kind: 'para', text: 'Allows the state to retain specified sales-tax revenue from sporting goods and equipment and direct it to conservation purposes including wildfire prevention, land and water projects, and outdoor recreation, rather than refunding that revenue under TABOR.' },
  { kind: 'sources', items: [
    { label: 'Proposition 137: Direct Sporting Goods Sales Tax Revenue for Conservation', url: 'https://bouldercoloradovoterguide.com/content/files/2026/09/proposition-137-direct-sporting-goods-sales-tax-revenue-for-conservation.pdf', tail: 'Colorado Blue Book' },
    { label: 'Certified 2026 statewide ballot measures', url: 'https://www.coloradosos.gov/pubs/elections/Initiatives/ballot/contacts/2026.html', tail: 'Colorado Secretary of State (official)' },
    { label: 'Colorado voters will be asked to redirect sporting goods sales tax revenue to conservation and wildfire restoration', url: 'https://coloradosun.com/2026/08/31/proposition-137-goco-wildfire-mitigation/', tail: 'Colorado Sun' },
    { label: 'Coloradans will decide whether to dedicate sales taxes from outdoor gear to conservation efforts', url: 'https://www.denverpost.com/2026/09/01/colorado-proposition-137-conservation-taxes/', tail: 'Denver Post' },
    { label: 'Ballot measure aims to shift Colorado sporting goods tax revenue to land, water and wildfire projects', url: 'https://www.coloradopolitics.com/2026/09/11/ballot-measure-aims-to-shift-colorado-sporting-goods-tax-revenue-to-land-water-and-wildfire-projects/', tail: 'Colorado Politics' },
    { label: 'Colorado proposal adds $65 million for wildfire mitigation, reduces TABOR refunds, report finds', url: 'https://www.coloradopolitics.com/2026/09/15/analysis-prop-137-would-add-65-million-for-wildfire-mitigation-reduce-tabor-refunds/', tail: 'Colorado Politics' },
    { label: 'AG Phil Weiser, Leaders Across Colorado Endorse Proposition 137', url: 'https://yellowscene.com/2026/09/25/ag-phil-weiser-leaders-across-colorado-endorse-proposition-137/', tail: 'Yellow Scene Magazine' },
    { label: 'Denver Water backs wildfire and water protection ballot initiative', url: 'https://coloradosun.com/2026/08/14/proposition-308-wildfire-water-protection-ballot-measure/', tail: 'Colorado Sun' },
    { label: 'Prop 137 will not prevent wildfires but will degrade our public lands', url: 'https://www.denverpost.com/2026/09/14/prop-137-logging-forests-degrade-lands/', tail: 'Denver Post (opinion)' },
    { label: 'EDITORIAL: No on 137 — the wrong way to care for forests', url: 'https://gazette.com/2026/09/18/editorial-no-on-137-the-wrong-way-to-care-for-forests/', tail: 'Colorado Springs Gazette (opinion)' }
  ] },

  { kind: 'h2', text: 'Boulder County Ballot Measures' },

  { kind: 'h3', text: 'Boulder County Ballot Issue 1A: TBD' },
  { kind: 'quote', caption: 'EARLY CHILDHOOD CARE AND EDUCATION MILL LEVY INCREASE AND VOTER-APPROVED REVENUE CHANGE', question: "SHALL BOULDER COUNTY TAXES BE INCREASED $30,000,000 ANNUALLY (IN TAX COLLECTION YEAR 2027), AND BY SUCH ADDITIONAL AMOUNTS RAISED ANNUALLY THEREAFTER, BY A MILL LEVY IMPOSED AT A RATE OF 2.579 MILLS (EQUATING TO APPROXIMATELY $115 PER YEAR ON A $725,000 HOME BASED ON CURRENT RATES OF ASSESSMENT) FOR THE PURPOSE OF ADDRESSING THE SHORTAGE AND HIGH COST OF CHILD CARE AND PRESCHOOL PROGRAMS FOR BOULDER COUNTY FAMILIES WITH YOUNG CHILDREN, INCLUDING: LOWERING THE HIGH COST OF CHILD CARE AND PRESCHOOL FOR BOULDER COUNTY FAMILIES; INCREASING THE COMPENSATION OF CHILD CARE AND PRESCHOOL TEACHERS AND STAFF TO RETAIN AND ATTRACT HIGH-QUALITY EDUCATORS; AND ADDRESSING THE SHORTAGE OF CARE BY EXPANDING CAPACITY FOR MORE CHILDREN AND REDUCING WAITLISTS; AND SHALL THE REVENUES AND THE EARNINGS ON THE INVESTMENT OF THE PROCEEDS OF SUCH TAX CONSTITUTE A VOTER-APPROVED REVENUE CHANGE UNDER ARTICLE X SECTION 20 OF THE COLORADO CONSTITUTION AND AN EXCEPTION TO THE LIMITATIONS SET FORTH IN SECTION 29-1-301 OF THE COLORADO REVISED STATUTES, ALL AS MORE PARTICULARLY SET FORTH IN BOARD OF COUNTY COMMISSIONERS' RESOLUTION NO. 2026-048?" },
  { kind: 'para', text: 'Would increase Boulder County property taxes by $30 million annually in the 2027 collection year through a 2.579-mill levy (about $115 per year on a $725,000 home at current assessment rates). Revenue would lower child-care and preschool costs, increase compensation for teachers and staff, and expand capacity and reduce waitlists.' },
  { kind: 'sources', items: [
    { label: 'Official ballot measures page (Issue 1A ballot language and tax estimate)', url: 'https://bouldercounty.gov/government/county-ballot-measures/', tail: 'Boulder County (official)' },
    { label: "Boulder County voters will decide a $30 million-a-year childcare tax. Here's what it would do.", url: 'https://boulderreportinglab.org/2026/09/13/boulder-county-voters-will-decide-a-30-million-a-year-childcare-tax-heres-what-it-would-do/', tail: 'Boulder Reporting Lab' },
    { label: 'Boulder County voters will decide childcare tax in November election', url: 'https://www.dailycamera.com/2026/07/24/boulder-county-childcare-tax-november-election/', tail: 'Daily Camera' },
    { label: 'Boulder County is putting childcare funding on the ballot this year', url: 'https://www.denver7.com/news/local-news/in-your-community/boulder-county/boulder-county-is-putting-childcare-funding-on-the-ballot-this-year', tail: 'Denver7' },
    { label: "Boulder County's Measure 1A Aims to Make Child Care More Affordable, Expand Access, and Support Early Childhood Educators", url: 'https://yellowscene.com/2026/09/22/boulder-countys-measure-1a-aims-to-make-child-care-more-affordable-expand-access-and-support-early-childhood-educators/', tail: 'Yellow Scene Magazine' },
    { label: "Trump's DOJ suing Colorado over in-state tuition for undocumented students; Boulder County leaders to consider new ballot measure aimed to fund childcare; lawsuit aims to block Denver-area ICE detention center", url: 'https://kgnu.org/trumps-doj-suing-colorado-over-in-state-tuition-for-undocumented-students-boulder-county-leaders-to-consider-new-ballot-measure-aimed-to-fund-childcare-lawsuit-aims-to-block-denver-area-ice/', tail: 'KGNU' },
    { label: 'Boulder County needs Bright Start child care funding now', url: 'https://www.dailycamera.com/2026/09/24/boulder-county-needs-bright-start-child-care-funding-now-opinion/', tail: 'Daily Camera (opinion)' },
    { label: 'Boulder County needs to fund affordable child care for a sustainable future', url: 'https://www.dailycamera.com/2026/07/28/boulder-county-commissioners-child-care-affordability-economy-property-tax/', tail: 'Daily Camera (opinion)' }
  ] },

  { kind: 'h3', text: 'Boulder County Ballot Question 200: TBD' },
  { kind: 'quote', question: 'Shall the membership of the Boulder County Board of Commissioners be increased from a three member board to a five member board?' },
  { kind: 'para', text: 'Expands the Boulder County Board of County Commissioners from three members to five. Organizers submitted 18,422 signatures; the Clerk issued a statement of sufficiency on August 5, and the commissioners certified the measure on August 25.' },
  { kind: 'sources', items: [
    { label: 'Erie Town Council votes 4-1 to endorse Boulder County commissioner expansion proposal', url: 'https://www.coloradohometownweekly.com/2026/09/23/erie-boulder-county-commissioner-expansion/', tail: 'Colorado Hometown Weekly' },
    { label: 'Pushes for expanded county commissions play out in Douglas and Boulder counties', url: 'https://www.denverpost.com/2026/09/08/boulder-douglas-county-commission-expansion-ballots/', tail: 'Denver Post' },
    { label: 'Boulder County petition effort clears hurdle for ballot measure to expand county commissioners from 3 to 5', url: 'https://www.dailycamera.com/2026/08/05/boulder-county-commissioners-expansion-ballot-signatures/', tail: 'Daily Camera' },
    { label: 'Measure to expand Boulder County commission from three to five members likely headed to November ballot', url: 'https://boulderreportinglab.org/2026/07/14/measure-to-expand-boulder-county-commission-from-three-to-five-members-likely-headed-to-november-ballot/', tail: 'Boulder Reporting Lab' },
    { label: 'Effort underway to put Boulder County commission expansion on 2026 ballot', url: 'https://boulderreportinglab.org/2026/01/22/effort-underway-to-put-boulder-county-commission-expansion-on-2026-ballot/', tail: 'Boulder Reporting Lab' },
    { label: 'Annmarie Jensen: Ballot Measure Announcements and Recommendations', url: 'https://yellowscene.com/2026/09/24/annmarie-jensen-ballot-measure-announcements-and-recommendations/', tail: 'Yellow Scene Magazine (opinion)' }
  ] },

  { kind: 'h3', text: 'Boulder County Ballot Question 201: TBD' },
  { kind: 'quote', question: 'If the membership of the Boulder County Board of Commissioners is increased from a three member board to a five member board, by what method shall the Boulder County Board of Commissioners be elected? (Vote for One)' },
  { kind: 'para', text: 'A conditional question that only takes effect if Question 200 passes: should all five commissioners be elected by voters in their respective districts, or should three district-elected commissioners be joined by two commissioners elected countywide?' },
  { kind: 'sources', items: [
    { label: 'Boulder Progressives Announces 2026 Ballot Measure Positions, Endorses Jamillah Richmond for Boulder City Council', url: 'https://yellowscene.com/2026/09/20/boulder-progressives-announces-2026-ballot-measure-positions-endorses-jamillah-richmond-for-boulder-city-council/', tail: 'Yellow Scene Magazine' },
    { label: "Five current and former Boulder County commissioners: Don't expand the commission to five seats", url: 'https://boulderreportinglab.org/2026/02/15/five-current-and-former-boulder-county-commissioners-dont-expand-the-commission-to-five-seats/', tail: 'Boulder Reporting Lab (opinion)' },
    { label: "Masyn Moyer and Tina Mueh: It's time for five Boulder County commissioners", url: 'https://boulderreportinglab.org/2026/03/01/masyn-moyer-and-tina-mueh-its-time-for-five-boulder-county-commissioners/', tail: 'Boulder Reporting Lab (opinion)' },
    { label: 'Annmarie Jensen: Ballot Measure Announcements and Recommendations', url: 'https://yellowscene.com/2026/09/24/annmarie-jensen-ballot-measure-announcements-and-recommendations/', tail: 'Yellow Scene Magazine (opinion)' }
  ] },

  { kind: 'h2', text: 'City of Boulder Ballot Measures' },

  { kind: 'h3', text: 'City of Boulder Ballot Issue 2J: TBD' },
  { kind: 'quote', caption: 'RESIDENTIAL VACANCY EXCISE TAX (TABOR)', question: 'SHALL THE CITY OF BOULDER TAXES BE INCREASED $6,000,000 ANNUALLY (WHICH AMOUNT REPRESENTS ESTIMATED REVENUES IN 2028, THE FIRST FULL FISCAL YEAR OF COLLECTION), AND BY SUCH AMOUNTS RAISED ANNUALLY THEREAFTER, BY IMPOSING A $4,000 TAX ON VACANT HOMES THAT ARE OCCUPIED FOR 183 DAYS OR LESS PER YEAR, WITH SUCH AMOUNT NEVER FALLING BELOW $4,000 BUT INCREASING ANNUALLY IN ACCORDANCE WITH THE DENVER-AURORA-LAKEWOOD CONSUMER PRICE INDEX UP TO, BUT NEVER EXCEEDING $7,000, WITH THE REVENUE FROM SUCH TAX TO BE USED FOR THE PURPOSE OF SUPPORTING CITY SERVICES, INCLUDING: POLICE AND FIRE PROTECTION; PARKS AND RECREATION; TRANSPORTATION AND MAINTENANCE; AND OTHER GENERAL SERVICES IMPORTANT TO THE QUALITY OF LIFE IN THE CITY; AND SHALL THE REVENUES FROM SUCH TAXES AND ANY RELATED EARNINGS BE COLLECTED, RETAINED, AND SPENT AS A VOTER-APPROVED REVENUE CHANGE WITHOUT LIMITATION AND AN EXCEPTION TO THE REVENUE AND SPENDING LIMITS OF ARTICLE X, SECTION 20 OF THE COLORADO CONSTITUTION?' },
  { kind: 'para', text: 'Imposes a $4,000 annual tax on residential properties occupied for 183 days or fewer per year, indexed annually to the Denver-Aurora-Lakewood consumer price index but never below $4,000 or above $7,000. The city estimates $6 million in revenue in 2028, the first full collection year; revenue would support general city services.' },
  { kind: 'sources', items: [
    { label: 'Official 2026 Ballot Measures Guide (definition, tax amount, cap, and uses)', url: 'https://bouldercolorado.gov/2026-city-boulder-ballot-measures', tail: 'City of Boulder (official)' },
    { label: 'Homes that sit empty in Boulder could get a vacancy tax if measure makes November ballot', url: 'https://www.dailycamera.com/2026/06/26/boulder-vacancy-tax-ballot-measure/', tail: 'Daily Camera' },
    { label: 'Boulder City Council advances ballot measures for vacant home tax, rec center bonds', url: 'https://boulderreportinglab.org/2026/06/28/boulder-city-council-advances-ballot-measures-for-vacant-home-tax-rec-center-bonds/', tail: 'Boulder Reporting Lab' },
    { label: 'Boulder voters to decide on vacancy tax, $400 million infrastructure bond measure', url: 'https://www.dailycamera.com/2026/08/07/boulder-tax-measures-ballot/', tail: 'Daily Camera' },
    { label: "Boulder voters to see so-called 'vacant' homes tax on ballot", url: 'https://completecolorado.com/2026/09/25/boulder-voters-excise-tax-so-called-vacant-homes/', tail: 'Complete Colorado' },
    { label: 'Boulder City Council sends vacancy tax and $400 million bond to November ballot, rejects downtown development authority', url: 'https://boulderreportinglab.org/2026/08/06/boulder-city-council-sends-vacancy-tax-and-400-million-bond-to-november-ballot-rejects-downtown-development-authority/', tail: 'Boulder Reporting Lab' },
    { label: 'Community Editorial Board: Considering the November ballot', url: 'https://www.dailycamera.com/2026/08/29/community-editorial-board-considering-the-november-ballot/', tail: 'Daily Camera (opinion)' },
    { label: "Boulder's vacancy tax would harm those trying to help the world; a new pledge; practical climate policies (Letters)", url: 'https://www.dailycamera.com/2026/09/16/boulder-vacancy-tax-ballot-measure-vote-election-midterm/', tail: 'Daily Camera (opinion)' }
  ] },

  { kind: 'h3', text: 'City of Boulder Ballot Issue 2K: TBD' },
  { kind: 'quote', caption: 'RECREATION AND SAFETY BOND (TABOR)', question: 'SHALL CITY OF BOULDER DEBT BE INCREASED UP TO $400,000,000, WITH A MAXIMUM REPAYMENT COST UP TO $650,000,000, AND SHALL CITY TAXES BE INCREASED UP TO $32,500,000 ANNUALLY FOR THE PURPOSE OF FINANCING THE CONSTRUCTION, RENOVATION, OR REPLACEMENT OF COMMUNITY RECREATION, SAFETY INFRASTRUCTURE, AND OTHER CAPITAL PROJECTS, SUCH AS: I) THE SOUTH BOULDER RECREATION CENTER, INCLUDING A LAP POOL; II) THE NORTH BOULDER RECREATION CENTER, INCLUDING AQUATICS AMENITIES AND IMPROVEMENTS NEEDED TO CO-LOCATE WEST AGE WELL SENIOR CENTER; III) FIRE STATIONS (TO SUSTAIN EMERGENCY AND WILDFIRE RESPONSE CAPABILITIES); IV) A NEW PUBLIC SAFETY BUILDING FOR POLICE AND 911 SERVICES; V) PENFIELD TATE II MUNICIPAL BUILDING; AND VI) THE MUNICIPAL SERVICE CENTER (TO SUPPORT INFRASTRUCTURE SERVICES, SUCH AS SNOW REMOVAL, UTILITY MAINTENANCE, AND CITY STREET OPERATIONS); IN ORDER TO SUPPORT RECREATION, SAFETY, AND CRITICAL INFRASTRUCTURE NEEDS FOR COMMUNITY MEMBERS OF ALL AGES; THROUGH THE ISSUANCE AND PAYMENT OF GENERAL OBLIGATION DEBT, WITH SUCH DEBT CONTAINING SUCH TERMS, NOT INCONSISTENT HEREWITH, AS THE CITY COUNCIL MAY DETERMINE; AND IN CONNECTION THEREWITH, SHALL AD VALOREM PROPERTY TAXES BE LEVIED WITHOUT LIMITATION AS TO THE RATE, BUT NOT MORE THAN THE AMOUNTS LISTED ABOVE, TO GENERATE AN AMOUNT SUFFICIENT IN EACH YEAR TO PAY THE PRINCIPAL OF, PREMIUM, IF ANY, AND INTEREST ON SUCH DEBT OR ANY REFUNDING DEBT (OR TO CREATE A RESERVE FOR SUCH PAYMENT); AND SHALL THE PROCEEDS OF SUCH DEBT AND RESERVES AND THE REVENUES FROM SUCH TAXES AND ANY INVESTMENT INCOME EARNED FROM SUCH PROCEEDS AND REVENUES BE COLLECTED AND SPENT WITHOUT LIMITATION OR CONDITION AS A VOTER-APPROVED REVENUE CHANGE AND AN EXCEPTION TO THE LIMITS THAT WOULD OTHERWISE APPLY UNDER ARTICLE X, SECTION 20 OF THE COLORADO CONSTITUTION OR ANY OTHER LAW?' },
  { kind: 'para', text: 'Authorizes up to $400 million in city debt, with a maximum repayment cost of up to $650 million, financed through an additional property tax of up to $32.5 million annually. Projects include the South and North Boulder recreation centers, Fire Stations 1 and 5, a new Public Safety Building and 911 dispatch, Penfield Tate II Municipal Building, and the Municipal Service Center.' },
  { kind: 'sources', items: [
    { label: 'Official 2026 Ballot Measures Guide (ballot language and project list)', url: 'https://bouldercolorado.gov/2026-city-boulder-ballot-measures', tail: 'City of Boulder (official)' },
    { label: 'Boulder City Council advances ballot measures for vacant home tax, rec center bonds', url: 'https://boulderreportinglab.org/2026/06/28/boulder-city-council-advances-ballot-measures-for-vacant-home-tax-rec-center-bonds/', tail: 'Boulder Reporting Lab' },
    { label: "Boulder's recreation centers need repairs. How will they be funded?", url: 'https://www.dailycamera.com/2026/08/05/boulder-recreation-centers-repairs-funding/', tail: 'Daily Camera' },
    { label: 'Boulder voters to decide on vacancy tax, $400 million infrastructure bond measure', url: 'https://www.dailycamera.com/2026/08/07/boulder-tax-measures-ballot/', tail: 'Daily Camera' },
    { label: "Boulder's Spruce Pool will stay open in 2027. After that, its future is unclear.", url: 'https://boulderreportinglab.org/2026/09/01/boulders-spruce-pool-will-stay-open-in-2027-after-that-its-future-is-unclear/', tail: 'Boulder Reporting Lab' },
    { label: 'Boulder Chamber Releases First Round of Ballot Endorsements', url: 'https://yellowscene.com/2026/09/12/boulder-chamber-releases-first-round-of-ballot-endorsements/', tail: 'Yellow Scene Magazine' },
    { label: 'Boulder City Council sends vacancy tax and $400 million bond to November ballot, rejects downtown development authority', url: 'https://boulderreportinglab.org/2026/08/06/boulder-city-council-sends-vacancy-tax-and-400-million-bond-to-november-ballot-rejects-downtown-development-authority/', tail: 'Boulder Reporting Lab' },
    { label: 'Boulder ballots may see tax measures in 2026', url: 'https://www.dailycamera.com/2026/03/14/boulder-2026-ballot-measures-taxes/', tail: 'Daily Camera' },
    { label: 'Burton: The City of Boulder deferred more than maintenance', url: 'https://www.dailycamera.com/2026/08/05/jan-burton-city-boulder-deferred-maintenance-facilities-budget-governance/', tail: 'Daily Camera (opinion)' }
  ] },

  { kind: 'h3', text: 'City of Boulder Ballot Question 2L: TBD' },
  { kind: 'quote', caption: 'Bargaining Rights Union Firefighters in City Charter', question: 'Shall the City amend its charter by the addition of a new Sec. 73, “Collective Bargaining for Firefighters,” as described in Ordinance 8761 which provides a charter guaranteed right for full-time fire department employees to bargain collectively over matters related to safety, wages, benefits, and all other terms and conditions employment, except those certain terms that are reserved to rights of management as defined in the proposed charter amendment, with impasse to be resolved through non-binding factfinding followed, if necessary, by a vote of the qualified electors of the City?' },
  { kind: 'para', text: 'Adds a charter-guaranteed right for full-time fire department employees to bargain collectively over safety, wages, benefits, and other terms and conditions of employment, subject to specified management rights. Impasse would proceed to non-binding factfinding and, if necessary, a vote of qualified city electors.' },
  { kind: 'sources', items: [
    { label: 'Official 2026 Ballot Measures Guide (explanation and ballot language)', url: 'https://bouldercolorado.gov/2026-city-boulder-ballot-measures', tail: 'City of Boulder (official)' },
    { label: 'City Council Voices Support for Four November Ballot Measures', url: 'https://bouldercolorado.gov/news/city-council-voices-support-four-november-ballot-measures', tail: 'City of Boulder' },
    { label: 'Boulder firefighters could have their collective bargaining rights secured in November', url: 'https://www.dailycamera.com/2026/08/11/boulder-firefighters-union-ballot/', tail: 'Daily Camera' },
    { label: 'Boulder Progressives Announces 2026 Ballot Measure Positions, Endorses Jamillah Richmond for Boulder City Council', url: 'https://yellowscene.com/2026/09/20/boulder-progressives-announces-2026-ballot-measure-positions-endorses-jamillah-richmond-for-boulder-city-council/', tail: 'Yellow Scene Magazine' },
    { label: 'Boulder City Council sends vacancy tax and $400 million bond to November ballot, rejects downtown development authority', url: 'https://boulderreportinglab.org/2026/08/06/boulder-city-council-sends-vacancy-tax-and-400-million-bond-to-november-ballot-rejects-downtown-development-authority/', tail: 'Boulder Reporting Lab' }
  ] },

  { kind: 'h3', text: 'City of Boulder Ballot Question 2M: TBD' },
  { kind: 'quote', caption: 'Debt Limit City Charter Language Change', question: "Shall Section 97 of the Boulder Home Rule Charter be amended pursuant to Ordinance 8762 to modify the City's debt limitation to be not more than three percent of the actual value of the taxable property within the City?" },
  { kind: 'para', text: "Amends the city charter so Boulder's debt limit is calculated as no more than three percent of the actual value of taxable property rather than assessed value. The city says this is consistent with how most municipalities and the state calculate debt limitation." },
  { kind: 'sources', items: [
    { label: 'Official 2026 Ballot Measures Guide (explanation and ballot language)', url: 'https://bouldercolorado.gov/2026-city-boulder-ballot-measures', tail: 'City of Boulder (official)' },
    { label: 'City Council Voices Support for Four November Ballot Measures', url: 'https://bouldercolorado.gov/news/city-council-voices-support-four-november-ballot-measures', tail: 'City of Boulder' },
    { label: 'Boulder Chamber Releases First Round of Ballot Endorsements', url: 'https://yellowscene.com/2026/09/12/boulder-chamber-releases-first-round-of-ballot-endorsements/', tail: 'Yellow Scene Magazine' },
    { label: 'Boulder Progressives Announces 2026 Ballot Measure Positions, Endorses Jamillah Richmond for Boulder City Council', url: 'https://yellowscene.com/2026/09/20/boulder-progressives-announces-2026-ballot-measure-positions-endorses-jamillah-richmond-for-boulder-city-council/', tail: 'Yellow Scene Magazine' },
    { label: 'Boulder City Council sends vacancy tax and $400 million bond to November ballot, rejects downtown development authority', url: 'https://boulderreportinglab.org/2026/08/06/boulder-city-council-sends-vacancy-tax-and-400-million-bond-to-november-ballot-rejects-downtown-development-authority/', tail: 'Boulder Reporting Lab' }
  ] },

  { kind: 'h2', text: 'Front Range Passenger Rail District' },
  { kind: 'h3', text: 'Front Range Passenger Rail District Ballot Issue 7A: TBD' },
  { kind: 'quote', question: 'SHALL FRONT RANGE PASSENGER RAIL DISTRICT TAXES BE INCREASED $295,000,000 ANNUALLY AND BY WHATEVER AMOUNTS ARE RAISED ANNUALLY THEREAFTER, AND SHALL FRONT RANGE PASSENGER RAIL DISTRICT DEBT BE INCREASED $580,000,000, WITH A REPAYMENT COST OF $785,000,000; TO CONSTRUCT, OPERATE, AND MAINTAIN COLORADO CONNECTOR (COCO) PASSENGER RAIL SERVICE ON COLORADO’S FRONT RANGE AND CONNECT COMMUNITIES, INCLUDING PUEBLO, COLORADO SPRINGS, STERLING RANCH, LITTLETON, DENVER, WESTMINSTER, BROOMFIELD, LOUISVILLE, BOULDER, LONGMONT, LOVELAND, AND FORT COLLINS; IN ORDER TO: REMOVE VEHICLES FROM HIGHWAYS AND INCREASE TRAVEL CAPACITY; CONNECT TRAVELERS TO EMPLOYMENT CENTERS, COLLEGES, SPORTS ARENAS, AND ENTERTAINMENT HUBS ALONG THE FRONT RANGE; AND INVEST IN STATION AREA IMPROVEMENTS AND LOCAL CONNECTIONS TO RAIL STATIONS; BY ESTABLISHING A 0.333% SALES AND USE TAX (EQUAL TO ONE THIRD OF A PENNY ON A $1 PURCHASE), WITH EXEMPTIONS PROVIDED UNDER COLORADO LAW, INCLUDING THOSE FOR GASOLINE, FOOD, RESIDENTIAL ELECTRICITY AND GAS, PRESCRIPTION DRUGS, AND MEDICAL SUPPLIES; AND TO RETAIN ALL SUCH REVENUES, PUBLIC AND PRIVATE CONTRIBUTIONS, AND ANY INVESTMENT INCOME ON REVENUES AND DEBT PROCEEDS, AS A VOTER-APPROVED REVENUE CHANGE UNDER SECTION 20 OF ARTICLE X OF THE COLORADO CONSTITUTION; AND REQUIRING THAT ALL SUCH DEDICATED REVENUES BE REVIEWED ANNUALLY BY AN INDEPENDENT AUDITOR AND A ROTATING GROUP OF CITIZEN TAXPAYERS WHO LIVE IN THE DISTRICT?' },
  { kind: 'para', text: "Would create a third-of-cent (0.333%) sales and use tax within the Front Range Passenger Rail District and authorize $580 million in debt to construct, operate, and maintain Colorado Connector passenger rail service between Pueblo and Denver, including Boulder and Fort Collins. The initial phase covers the northern route between Denver and Fort Collins and is expected to start service in 2029; it is already funded through metro Denver's Regional Transportation District." },
  { kind: 'sources', items: [
    { label: 'Official district website', url: 'https://www.frprdistrict.com/', tail: 'Front Range Passenger Rail District (official)' },
    { label: 'SB 26-172 (referring legislation)', url: 'https://leg.colorado.gov/bills/SB26-172', tail: 'Colorado General Assembly (official)' },
    { label: 'Front Range Passenger Rail puts sales tax on ballot to fund Colorado Connector expansion', url: 'https://www.denverpost.com/2026/08/28/colorado-front-range-rail-ballot-sales-tax/', tail: 'Denver Post' },
    { label: 'Front Range voters will be asked to approve sales tax hike to pay for train between Fort Collins and Pueblo', url: 'https://coloradosun.com/2026/08/28/sales-tax-ballot-question-2026-front-range-train/', tail: 'Colorado Sun' },
    { label: 'Front Range cities will vote on tax measure to fund Colorado Connector rail service', url: 'https://coloradonewsline.com/2026/08/28/front-range-cities-vote-colorado-connector/', tail: 'Colorado Newsline' },
    { label: 'Voters in the Front Range Passenger Rail District will weigh in on new sales tax for CoCo passenger train', url: 'https://www.cpr.org/2026/08/28/colorado-connector-front-range-rail-sales-tax-ballot-question/', tail: 'CPR News' },
    { label: 'Besides a passenger train, Colorado Connector could return millions in tax dollars to Boulder-area cities', url: 'https://www.denverpost.com/2026/08/27/boulder-colorado-connector-local-return-program/', tail: 'Denver Post' },
    { label: 'How would a Front Range train work, what would it cost, and when would it start?', url: 'https://coloradosun.com/2026/07/21/front-range-rail-potential-vote-sales-tax-colorado/', tail: 'Colorado Sun' },
    { label: "EDITORIAL: No to 'CoCo' — the white elephant on rails", url: 'https://www.denvergazette.com/2026/09/13/editorial-no-to-coco-the-white-elephant-on-rails/', tail: 'Denver Gazette (opinion)' },
    { label: 'GUEST COLUMN: Front Range Rail repeats the mistakes of FasTracks', url: 'https://www.denvergazette.com/2026/07/30/guest-column-front-range-rail-repeats-the-mistakes-of-fastracks/', tail: 'Denver Gazette (opinion)' }
  ] }
];
