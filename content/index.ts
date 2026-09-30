/**
 * Registry of every content page. To add a page, create its file and import it here.
 * The order inside each list is the order of items in the navigation menus.
 */
import maglumiX10 from "./products/maglumi-x10.ts";
import maglumiX8 from "./products/maglumi-x8.ts";
import maglumiX6 from "./products/maglumi-x6.ts";
import maglumiX3 from "./products/maglumi-x3.ts";
import biossaysC10 from "./products/biossays-c10.ts";
import biossays240Plus from "./products/biossays-240-plus.ts";
import biossaysE6Plus from "./products/biossays-e6-plus.ts";
import d100 from "./products/d-100.ts";
import d10 from "./products/d-10.ts";
import variantIi from "./products/variant-ii.ts";
import variantIiTurbo from "./products/variant-ii-turbo.ts";
import ih500NextSystem from "./products/ih-500-next-system.ts";
import ih1000 from "./products/ih-1000.ts";
import ihReader24 from "./products/ih-reader-24.ts";
import bioplex2200System from "./products/bioplex-2200-system.ts";
import phdLxSystem from "./products/phd-lx-system.ts";
import geeniusSystem from "./products/geenius-system.ts";
import satlarsTca from "./products/satlars-tca.ts";
import satlarsT8 from "./products/satlars-t8.ts";
import satlarsMiniT8 from "./products/satlars-mini-t8.ts";
import molecisionMp96 from "./products/molecision-mp-96.ts";
import molecisionMp32 from "./products/molecision-mp-32.ts";
import molecisionS6 from "./products/molecision-s6.ts";
import molecisionR8 from "./products/molecision-r8.ts";
import hemolumiH6 from "./products/hemolumi-h6.ts";
import ihSystemsReagents from "./products/ih-systems-reagents.ts";
import gelTesting from "./products/gel-testing.ts";
import tubeTesting from "./products/tube-testing.ts";
import chromogenicCultureMedia from "./products/chromogenic-culture-media.ts";
import bloodAgarMedia from "./products/blood-agar-media.ts";
import maglumiCliaTestMenu278Parameters from "./products/maglumi-clia-test-menu-278-parameters.ts";
import biochemistryTestMenu from "./products/biochemistry-test-menu.ts";
import inteliq from "./products/inteliq.ts";
import immunoassayControls from "./products/immunoassay-controls.ts";
import infectiousDiseaseControls from "./products/infectious-disease-controls.ts";
import liquichekSerumIndices from "./products/liquichek-serum-indices.ts";
import unityNextPeerQc from "./products/unity-next-peer-qc.ts";
import unityweb from "./products/unityweb.ts";
import unityRealTime from "./products/unity-real-time.ts";
import bricare from "./products/bricare.ts";
import ihCom from "./products/ih-com.ts";
import metabolicPanel from "./clinical/metabolic-panel.ts";
import maglumiThyroidPanel from "./clinical/maglumi-thyroid-panel.ts";
import oncopanelMaglumiOncomarkers from "./clinical/oncopanel-maglumi-oncomarkers.ts";
import bioplex2200InfectionPanels from "./clinical/bioplex-2200-infection-panels.ts";
import maglumiInfectionPanel from "./clinical/maglumi-infection-panel.ts";
import systemicAutoimmuneTests from "./clinical/systemic-autoimmune-tests.ts";
import vasculitis from "./clinical/vasculitis.ts";
import maglumiCardiacMarkers from "./clinical/maglumi-cardiac-markers.ts";
import cardiacAdvanceQc from "./clinical/cardiac-advance-qc.ts";
import gelTubeTesting from "./clinical/gel-tube-testing.ts";
import bioRad from "./brand-pages/bio-rad.ts";
import bioRadDiabetes from "./brand-pages/bio-rad-diabetes.ts";
import bioRadAutoimmunity from "./brand-pages/bio-rad-autoimmunity.ts";
import bioRadQualityControlQc from "./brand-pages/bio-rad-quality-control-qc.ts";
import bioRadImmunohematology from "./brand-pages/bio-rad-immunohematology.ts";
import snibe from "./brand-pages/snibe.ts";
import snibeMaglumiImmunochemistry from "./brand-pages/snibe-maglumi-immunochemistry.ts";
import snibeBiossaysBiochemistry from "./brand-pages/snibe-biossays-biochemistry.ts";
import snibeSatlarsAutomation from "./brand-pages/snibe-satlars-automation.ts";
import snibeMolecisionMolecularDiagnostics from "./brand-pages/snibe-molecision-molecular-diagnostics.ts";

export const products = [
  maglumiX10,
  maglumiX8,
  maglumiX6,
  maglumiX3,
  biossaysC10,
  biossays240Plus,
  biossaysE6Plus,
  d100,
  d10,
  variantIi,
  variantIiTurbo,
  ih500NextSystem,
  ih1000,
  ihReader24,
  bioplex2200System,
  phdLxSystem,
  geeniusSystem,
  satlarsTca,
  satlarsT8,
  satlarsMiniT8,
  molecisionMp96,
  molecisionMp32,
  molecisionS6,
  molecisionR8,
  hemolumiH6,
  ihSystemsReagents,
  gelTesting,
  tubeTesting,
  chromogenicCultureMedia,
  bloodAgarMedia,
  maglumiCliaTestMenu278Parameters,
  biochemistryTestMenu,
  inteliq,
  immunoassayControls,
  infectiousDiseaseControls,
  liquichekSerumIndices,
  unityNextPeerQc,
  unityweb,
  unityRealTime,
  bricare,
  ihCom,
] as const;

export const clinicalPages = [
  metabolicPanel,
  maglumiThyroidPanel,
  oncopanelMaglumiOncomarkers,
  bioplex2200InfectionPanels,
  maglumiInfectionPanel,
  systemicAutoimmuneTests,
  vasculitis,
  maglumiCardiacMarkers,
  cardiacAdvanceQc,
  gelTubeTesting,
] as const;

export const brandPages = [
  bioRad,
  bioRadDiabetes,
  bioRadAutoimmunity,
  bioRadQualityControlQc,
  bioRadImmunohematology,
  snibe,
  snibeMaglumiImmunochemistry,
  snibeBiossaysBiochemistry,
  snibeSatlarsAutomation,
  snibeMolecisionMolecularDiagnostics,
] as const;
