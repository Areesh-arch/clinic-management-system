import { useMemo, useState } from "react";

import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiUser,
} from "react-icons/fi";

function AppointmentCalendar({
  appointments = [],
  onView,
}) {
  const today = new Date();

  const [currentMonth, setCurrentMonth] =
    useState(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

  const monthName = currentMonth.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  const calendarDays = useMemo(() => {
    const year =
      currentMonth.getFullYear();

    const month =
      currentMonth.getMonth();

    const firstDay =
      new Date(
        year,
        month,
        1
      ).getDay();

    const daysInMonth =
      new Date(
        year,
        month + 1,
        0
      ).getDate();

    const previousMonthDays =
      new Date(
        year,
        month,
        0
      ).getDate();

    const totalCells =
      Math.ceil(
        (firstDay + daysInMonth) / 7
      ) * 7;

    const days = [];

    for (
      let index = 0;
      index < totalCells;
      index++
    ) {
      const dayNumber =
        index - firstDay + 1;

      if (dayNumber <= 0) {
        const previousDay =
          previousMonthDays +
          dayNumber;

        days.push({
          date: new Date(
            year,
            month - 1,
            previousDay
          ),
          currentMonth: false,
        });
      } else if (
        dayNumber > daysInMonth
      ) {
        const nextDay =
          dayNumber - daysInMonth;

        days.push({
          date: new Date(
            year,
            month + 1,
            nextDay
          ),
          currentMonth: false,
        });
      } else {
        days.push({
          date: new Date(
            year,
            month,
            dayNumber
          ),
          currentMonth: true,
        });
      }
    }

    return days;
  }, [currentMonth]);

  const getDateKey = (date) => {
    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const appointmentsByDate =
    useMemo(() => {
      const grouped = {};

      appointments.forEach(
        (appointment) => {
          if (
            !appointment?.appointment_date
          ) {
            return;
          }

          const key =
            appointment.appointment_date;

          if (!grouped[key]) {
            grouped[key] = [];
          }

          grouped[key].push(
            appointment
          );
        }
      );

      Object.keys(grouped).forEach(
        (key) => {
          grouped[key].sort(
            (a, b) =>
              String(
                a.appointment_time || ""
              ).localeCompare(
                String(
                  b.appointment_time || ""
                )
              )
          );
        }
      );

      return grouped;
    }, [appointments]);

  const formatTime = (value) => {
    if (!value) {
      return "-";
    }

    const [hours, minutes] =
      String(value).split(":");

    const parsedHours =
      Number(hours);

    const parsedMinutes =
      Number(minutes);

    if (
      Number.isNaN(parsedHours) ||
      Number.isNaN(parsedMinutes)
    ) {
      return value;
    }

    const date = new Date();

    date.setHours(
      parsedHours,
      parsedMinutes,
      0,
      0
    );

    return date.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  const getPatientName = (
    appointment
  ) => {
    return (
      appointment?.patient_name ||
      appointment?.patient?.full_name ||
      appointment?.patient?.name ||
      `Patient #${appointment?.patient_id || ""}`
    );
  };

  const getStatus = (value) => {
    const status =
      String(value || "")
        .trim()
        .toLowerCase();

    if (
      status === "completed"
    ) {
      return {
        label: "Completed",
        className:
          "bg-[#E7F0E5] text-[#456247]",
      };
    }

    if (
      status === "cancelled" ||
      status === "canceled"
    ) {
      return {
        label: "Cancelled",
        className:
          "bg-[#F8EAEA] text-[#9A5555]",
      };
    }

    if (
      status === "no_show" ||
      status === "no-show" ||
      status === "noshow"
    ) {
      return {
        label: "No Show",
        className:
          "bg-[#F7EEE4] text-[#956A43]",
      };
    }

    return {
      label: "Pending",
      className:
        "bg-[#EEF3EC] text-[#647760]",
    };
  };

  const todayKey =
    getDateKey(today);

  const goToPreviousMonth = () => {
    setCurrentMonth(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() - 1,
          1
        )
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + 1,
          1
        )
    );
  };

  const goToToday = () => {
    setCurrentMonth(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );
  };

  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border border-[#E1E7DF]
        bg-white
        shadow-sm
      "
    >
      <div
        className="
          flex flex-col
          gap-4
          border-b border-[#E7EBE5]
          bg-[#FAF8F3]
          px-5 py-5
          md:flex-row
          md:items-center
          md:justify-between
          md:px-6
        "
      >
        <div>
          <h2
            className="
              text-2xl
              font-bold
              text-[#294936]
            "
          >
            {monthName}
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-[#7A827C]
            "
          >
            View scheduled appointments by date.
          </p>
        </div>

        <div
          className="
            flex items-center gap-2
          "
        >
          <button
            type="button"
            onClick={goToToday}
            className="
              rounded-xl
              border border-[#DDE5DB]
              bg-white
              px-4 py-2
              text-sm
              font-semibold
              text-[#5F6B62]
              transition
              hover:border-[#BFCDBB]
              hover:bg-[#EEF3EC]
              hover:text-[#294936]
            "
          >
            Today
          </button>

          <button
            type="button"
            onClick={goToPreviousMonth}
            className="
              flex h-10 w-10
              items-center
              justify-center
              rounded-xl
              border border-[#DDE5DB]
              bg-white
              text-[#6B756D]
              transition
              hover:bg-[#EEF3EC]
              hover:text-[#294936]
            "
            title="Previous month"
          >
            <FiChevronLeft size={19} />
          </button>

          <button
            type="button"
            onClick={goToNextMonth}
            className="
              flex h-10 w-10
              items-center
              justify-center
              rounded-xl
              border border-[#DDE5DB]
              bg-white
              text-[#6B756D]
              transition
              hover:bg-[#EEF3EC]
              hover:text-[#294936]
            "
            title="Next month"
          >
            <FiChevronRight size={19} />
          </button>
        </div>
      </div>

      <div
        className="
          grid grid-cols-7
          border-b border-[#E7EBE5]
          bg-[#F5F7F3]
        "
      >
        {[
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
        ].map((day) => (
          <div
            key={day}
            className="
              px-2 py-3
              text-center
              text-xs
              font-bold
              uppercase
              tracking-wide
              text-[#7A827C]
              md:text-sm
            "
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarDays.map(
          ({
            date,
            currentMonth: isCurrentMonth,
          }) => {
            const dateKey =
              getDateKey(date);

            const dayAppointments =
              appointmentsByDate[
                dateKey
              ] || [];

            const isToday =
              dateKey === todayKey;

            return (
              <div
                key={dateKey}
                className={`
                  min-h-36
                  border-b
                  border-r
                  border-[#E8ECE6]
                  p-2
                  md:min-h-40
                  md:p-3
                  ${
                    !isCurrentMonth
                      ? "bg-[#F8F7F3]"
                      : "bg-white"
                  }
                `}
              >
                <div className="mb-2 flex justify-end">
                  <span
                    className={`
                      flex h-7 w-7
                      items-center
                      justify-center
                      rounded-full
                      text-xs
                      font-semibold
                      ${
                        isToday
                          ? "bg-[#294936] text-white"
                          : isCurrentMonth
                          ? "text-[#5F6B62]"
                          : "text-[#C5CAC5]"
                      }
                    `}
                  >
                    {date.getDate()}
                  </span>
                </div>

                <div className="space-y-2">
                  {dayAppointments
                    .slice(0, 3)
                    .map(
                      (appointment) => {
                        const status =
                          getStatus(
                            appointment.status
                          );

                        return (
                          <button
                            key={
                              appointment.id
                            }
                            type="button"
                            onClick={() =>
                              onView &&
                              onView(
                                appointment
                              )
                            }
                            className="
                              group
                              w-full
                              rounded-xl
                              border
                              border-[#E1E7DF]
                              bg-[#FAFCF9]
                              p-2
                              text-left
                              transition-all
                              duration-200
                              hover:border-[#BFCDBB]
                              hover:bg-[#EEF3EC]
                              hover:shadow-sm
                            "
                          >
                            <div
                              className="
                                flex
                                items-center
                                gap-1
                                text-[11px]
                                font-semibold
                                text-[#647760]
                              "
                            >
                              <FiClock size={11} />
                              {formatTime(
                                appointment.appointment_time
                              )}
                            </div>

                            <div
                              className="
                                mt-1
                                flex
                                items-center
                                gap-1
                                text-xs
                                font-semibold
                                text-[#294936]
                              "
                            >
                              <FiUser
                                size={11}
                                className="shrink-0"
                              />

                              <span className="truncate">
                                {getPatientName(
                                  appointment
                                )}
                              </span>
                            </div>

                            {appointment.reason && (
                              <div
                                className="
                                  mt-1
                                  truncate
                                  text-[10px]
                                  text-[#89918B]
                                "
                              >
                                {appointment.reason}
                              </div>
                            )}

                            <span
                              className={`
                                mt-1.5
                                inline-flex
                                rounded-full
                                px-2 py-0.5
                                text-[9px]
                                font-semibold
                                ${status.className}
                              `}
                            >
                              {status.label}
                            </span>
                          </button>
                        );
                      }
                    )}

                  {dayAppointments.length > 3 && (
                    <div
                      className="
                        px-2
                        text-[10px]
                        font-semibold
                        text-[#647760]
                      "
                    >
                      +
                      {dayAppointments.length -
                        3}{" "}
                      more
                    </div>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>

      {appointments.length === 0 && (
        <div
          className="
            border-t border-[#E7EBE5]
            bg-[#FAF8F3]
            px-6 py-10
            text-center
          "
        >
          <p
            className="
              font-semibold
              text-[#69736B]
            "
          >
            No appointments found.
          </p>

          <p
            className="
              mt-1
              text-sm
              text-[#919891]
            "
          >
            Appointments will appear here when they are scheduled.
          </p>
        </div>
      )}
    </div>
  );
}

export default AppointmentCalendar;
