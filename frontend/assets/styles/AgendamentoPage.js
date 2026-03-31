import { StyleSheet } from "react-native";
const GRID_GAP = 12;
const AgendamentoStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  loadingText: {
    marginTop: 14,
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },

  scrollContent: {
     flexGrow: 1,
  paddingBottom: 30,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerLogoImage: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginRight: 14,
  },

  headerLogoFallback: {
    width: 52,
    height: 52,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    marginRight: 14,
  },

  headerTitle: {
    flex: 1,
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  cardAgendamentoContain: {
    width: "100%",

  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },

  sectionDivider: {
    height: 1,
    backgroundColor: "#D1D5DB",
    marginVertical: 18,
  },

  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  serviceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  serviceImage: {
    width: "100%",
    height: 170,
    backgroundColor: "#E5E7EB",
  },

  serviceImageFallback: {
    width: "100%",
    height: 170,
    backgroundColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },

  serviceContent: {
    padding: 14,
  },

  serviceTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
  },

  servicePrice: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E40AF",
    marginBottom: 8,
  },

  availableBarbersText: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 14,
  },

  scheduleButton: {
    backgroundColor: "#1E40AF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  scheduleButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});

export default AgendamentoStyle;
