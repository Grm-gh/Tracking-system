import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

/* ================= SOCKET ================= */
const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
  transports: ["websocket"],
});

/* ================= USER ID ================= */
let userId = localStorage.getItem("userId");
if (!userId) {
  userId = "u_" + Math.random().toString(36).slice(2);
  localStorage.setItem("userId", userId);
}

/* ================= MARKER ICON ================= */
const personIcon = (name, isLeader, online) =>
  L.divIcon({
    className: "person-marker",
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="
          background:${isLeader ? "linear-gradient(135deg,#fde047,#f59e0b)" : "#2563eb"};
          color:black;
          font-size:13px;
          font-weight:600;
          padding:5px 10px;
          border-radius:999px;
          margin-bottom:4px;
          white-space:nowrap;
          box-shadow:${isLeader ? "0 0 14px rgba(245,158,11,.9)" : "0 2px 6px rgba(0,0,0,.3)"};
        ">
          ${isLeader ? "👑 " : ""}${name}
        </div>
        <div style="font-size:26px;opacity:${online ? 1 : 0.35}">🧍</div>
      </div>
    `,
    iconSize: [60, 70],
    iconAnchor: [30, 70],
  });

/* ================= AUTO ZOOM ================= */
function AutoZoom({ users }) {
  const map = useMap();
  useEffect(() => {
    const list = Object.values(users);
    if (!list.length) return;
    const points = list.map((u) => [u.latitude, u.longitude]);
    points.length === 1
      ? map.setView(points[0], 16)
      : map.fitBounds(points, { padding: [80, 80] });
  }, [users]);
  return null;
}

/* ================= ROUTE ================= */
function RouteToUser({ from, to, setDistance, routeControl, setRouteControl }) {
  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;

    if (routeControl) map.removeControl(routeControl);

    const control = L.Routing.control({
      waypoints: [
        L.latLng(from.latitude, from.longitude),
        L.latLng(to.latitude, to.longitude),
      ],
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
    })
      .on("routesfound", (e) =>
        setDistance((e.routes[0].summary.totalDistance / 1000).toFixed(2))
      )
      .addTo(map);

    setRouteControl(control);

    return () => map.removeControl(control);
  }, [from, to]);

  return null;
}

/* ================= MAIN ================= */
export default function MapPage() {
  const [params] = useSearchParams();
  const group = params.get("group");
  const name = params.get("name");

  const [users, setUsers] = useState({});
  const [leaderId, setLeaderId] = useState(null);
  const [started, setStarted] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [distance, setDistance] = useState(null);
  const [routeControl, setRouteControl] = useState(null);

  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);
  const [openMemberId, setOpenMemberId] = useState(null);

  const me = users[userId];
  const isLeader = userId === leaderId;

  /* ================= LOCATION ================= */
  useEffect(() => {
    if (!started) return;
    let watchId;

    const sendLocation = (pos) => {
      socket.emit("send-location", {
        group,
        userId,
        name,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        lastSeen: Date.now(),
      });
    };

    navigator.geolocation.getCurrentPosition(sendLocation, console.error, {
      enableHighAccuracy: false,
      maximumAge: 60000,
      timeout: 20000,
    });

    watchId = navigator.geolocation.watchPosition(sendLocation, console.error, {
      enableHighAccuracy: false,
      maximumAge: 60000,
      timeout: 20000,
    });

    socket.on("group-update", ({ users, leaderId }) => {
      const now = Date.now();
      Object.values(users).forEach(
        (u) => (u.online = now - u.lastSeen < 15000)
      );
      setUsers(users);
      setLeaderId(leaderId);
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.off("group-update");
    };
  }, [started]);

  /* ================= ACTIONS ================= */
  const leaveGroup = () => {
    socket.emit("leave-group", { group, userId });
    window.location.href = "/";
  };

  const clearRoute = () => {
    if (routeControl) {
      routeControl.remove();
      setRouteControl(null);
    }
    setSelectedUser(null);
    setDistance(null);
  };

  const changeLeader = (newLeaderId) => {
    socket.emit("change-leader", { group, newLeaderId });
  };

  /* ================= MARKERS ================= */
  const markers = useMemo(
    () =>
      Object.values(users).map((u) => (
        <Marker
          key={u.userId}
          position={[u.latitude, u.longitude]}
          icon={personIcon(u.name, u.userId === leaderId, u.online)}
        />
      )),
    [users, leaderId]
  );

  return (
    <div className="flex h-screen relative">
      {!started && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/60">
          <button
            onClick={() => setStarted(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg shadow-lg"
          >
            📍 Start Live Tracking
          </button>
        </div>
      )}

      {/* Mobile Toggle */}
      <button
        onClick={() => setShowSidebar((s) => !s)}
        className="absolute top-4 left-4 z-[1500] bg-blue-600 text-white px-4 py-2 rounded-lg shadow md:hidden"
      >
        ☰ Members
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full z-[1200]
        w-80 bg-white border-r p-4 overflow-y-auto
        transform transition-transform duration-300
        ${showSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <button
          onClick={leaveGroup}
          className="w-full mb-4 bg-red-600 text-white py-2 rounded"
        >
          🚪 Leave Group
        </button>

        <h2 className="font-bold text-lg mb-3">👥 Members</h2>

        <div className="space-y-2">
          {Object.values(users).map((u) => {
            const isOpen = openMemberId === u.userId;
            const leader = u.userId === leaderId;

            return (
              <div
                key={u.userId}
                onClick={() =>
                  setOpenMemberId(isOpen ? null : u.userId)
                }
                className={`rounded-lg border cursor-pointer
                ${leader ? "border-yellow-400 bg-yellow-50" : "border-gray-200 hover:bg-gray-50"}`}
              >
                <div className="flex justify-between items-center p-3">
                  <div>
                    <p className="font-medium flex gap-2 items-center">
                      {leader && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 shadow">
                          👑 Leader
                        </span>
                      )}
                      {u.name}
                      {u.userId === userId && (
                        <span className="text-xs text-gray-400">(You)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {u.online ? "🟢 Online" : "⚪ Offline"}
                    </p>
                  </div>

                  <div
                    className={`text-2xl transition-transform ${
                      isOpen ? "rotate-180 text-blue-600" : "text-gray-500"
                    }`}
                  >
                    ▼
                  </div>
                </div>

                {isOpen && (
                  <div className="px-4 pb-3 space-y-2 border-t text-sm">
                    {u.userId !== userId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(u);
                          setShowSidebar(false);
                        }}
                        className="w-full bg-blue-600 text-white py-1.5 rounded"
                      >
                        🧭 Show Route
                      </button>
                    )}

                    {isLeader && u.userId !== leaderId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          changeLeader(u.userId);
                        }}
                        className="w-full bg-yellow-500 text-black py-1.5 rounded"
                      >
                        👑 Make Leader
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedUser && distance && (
          <div className="mt-4 p-3 bg-blue-50 rounded space-y-2">
            <div>
              🧭 <b>{selectedUser.name}</b>
              <br />📏 {distance} km away
            </div>

            <button
              onClick={clearRoute}
              className="w-full bg-gray-700 text-white py-1.5 rounded"
            >
              ❌ Remove Path
            </button>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1">
        <MapContainer center={[20.59, 78.96]} zoom={5} style={{ height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <AutoZoom users={users} />
          {markers}
          {me && selectedUser && (
            <RouteToUser
              from={me}
              to={selectedUser}
              setDistance={setDistance}
              routeControl={routeControl}
              setRouteControl={setRouteControl}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
