import { StyleSheet, Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CALENDAR_ITEM_SIZE = (SCREEN_WIDTH - 80) / 7;

const HorariosStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  page: { backgroundColor: "#fff" },

  header: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerButton: { padding: 8 },
  headerBack: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },

  progressContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  progressActive: {
    flex: 1,
    height: 4,
    backgroundColor: "#1E3A8A",
    borderRadius: 2,
  },
  progressInactive: {
    flex: 1,
    height: 4,
    backgroundColor: "#D3D3D3",
    borderRadius: 2,
  },
  progressText: { color: "#808080", fontSize: 12, marginLeft: 8 },

  barbeiroBox: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F5F5F5",
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  barbeiroLabel: { color: "#808080", fontSize: 12 },
  barbeiroNome: { color: "#000", fontWeight: "bold", fontSize: 16, marginTop: 4 },

  calendarContainer: { paddingHorizontal: 16, paddingVertical: 16 },
  calendarNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navButton: { padding: 8 },
  navText: { color: "#1E3A8A", fontSize: 24, fontWeight: "bold" },
  monthText: {
    color: "#1E3A8A",
    fontWeight: "bold",
    fontSize: 18,
    textTransform: "capitalize",
  },

  weekRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  weekDay: {
    color: "#808080",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
    width: CALENDAR_ITEM_SIZE,
  },

  daysGrid: { flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between', },
  emptyDay: { width: CALENDAR_ITEM_SIZE, height: CALENDAR_ITEM_SIZE },
  dayBox: {
    width: CALENDAR_ITEM_SIZE,
    height: CALENDAR_ITEM_SIZE,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: "#D3D3D3",
  },
  daySelected: { backgroundColor: "#1E3A8A", borderColor: "#1E3A8A" },
  dayUnavailable: { backgroundColor: "#FEE2E2", borderColor: "#FCA5A5" },
  dayText: { fontWeight: "600", fontSize: 16, color: "#000" },
  dayTextSelected: { color: "#fff" },
  dayTextUnavailable: { color: "#DC2626" },

  horariosContainer: { paddingHorizontal: 16, paddingVertical: 16 },
  horariosTitle: { color: "#000", fontWeight: "bold", fontSize: 16, marginBottom: 12 },
  horariosGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  horarioBox: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: "#fff",
    borderColor: "#D3D3D3",
    minWidth: "30%",
    alignItems: "center",
  },
  horarioBoxSelected: { backgroundColor: "#1E3A8A", borderColor: "#1E3A8A" },
  horarioText: { fontWeight: "600", fontSize: 16, color: "#000", textAlign: "center" },
  horarioTextSelected: { color: "#fff" },

  noHorariosBox: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 8,
    padding: 16,
  },
  noHorariosText: { color: "#DC2626", fontWeight: "600" },
  noHorariosSub: { color: "#EF5350", fontSize: 12, marginTop: 4 },

  resumoBox: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#F0FDFA",
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0D9488",
    marginBottom: 16,
  },
  resumoLabel: { color: "#0D7377", fontWeight: "600", fontSize: 12 },
  resumoData: { color: "#000", fontWeight: "bold", fontSize: 16, marginTop: 8 },
  resumoHora: { color: "#000", fontWeight: "bold", fontSize: 16, marginTop: 4 },

  nextContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#D3D3D3",
  },
  nextButton: { paddingVertical: 16, borderRadius: 8, backgroundColor: "#1E3A8A" },
  nextButtonDisabled: { backgroundColor: "#D3D3D3" },
  nextButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16, textAlign: "center" },
});

export default HorariosStyle;
