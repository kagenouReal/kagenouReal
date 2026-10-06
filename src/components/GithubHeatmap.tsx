import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GitCommit, Flame, Calendar, RefreshCw, ExternalLink } from 'lucide-react';

interface ContributionDay {
  date: Date;
  dateStr: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface GithubHeatmapProps {
  username?: string;
}

export const GithubHeatmap: React.FC<GithubHeatmapProps> = ({ username = 'kagenouReal' }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [hoveredDay, setHoveredDay] = useState<{ day: ContributionDay; x: number; y: number } | null>(null);

  const fetchContributions = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
        { signal }
      );
      if (!response.ok) {
        throw new Error(`Contribution service returned HTTP ${response.status}`);
      }

      const payload: unknown = await response.json();
      if (!payload || typeof payload !== 'object') {
        throw new Error('Contribution service returned an invalid response');
      }

      const result = payload as {
        contributions?: unknown;
        total?: { lastYear?: unknown };
      };
      if (!Array.isArray(result.contributions) || result.contributions.length === 0) {
        throw new Error('Contribution service did not return daily activity');
      }

      const parseDate = d3.timeParse('%Y-%m-%d');
      const parsed = result.contributions.map((item: unknown): ContributionDay => {
        if (!item || typeof item !== 'object') {
          throw new Error('Contribution service returned an invalid day');
        }
        const contribution = item as { date?: unknown; count?: unknown };
        if (
          typeof contribution.date !== 'string' ||
          typeof contribution.count !== 'number' ||
          !Number.isFinite(contribution.count) ||
          contribution.count < 0
        ) {
          throw new Error('Contribution service returned an invalid day');
        }
        const date = parseDate(contribution.date);
        if (!date) throw new Error('Contribution service returned an invalid date');

        const count = contribution.count;
        const level: ContributionDay['level'] =
          count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 9 ? 3 : 4;
        return { date, dateStr: contribution.date, count, level };
      });

      parsed.sort((a, b) => a.date.getTime() - b.date.getTime());
      setData(parsed);
      const total = result.total?.lastYear;
      setTotalContributions(
        typeof total === 'number' && Number.isFinite(total)
          ? total
          : parsed.reduce((sum, day) => sum + day.count, 0)
      );

      const today = d3.timeDay.floor(new Date());
      const yesterday = d3.timeDay.offset(today, -1);
      let streakIndex = parsed.length - 1;
      if (parsed[streakIndex]?.date.getTime() === today.getTime() && parsed[streakIndex].count === 0) {
        streakIndex--;
      }

      let streak = 0;
      if (parsed[streakIndex]?.count > 0 && parsed[streakIndex].date.getTime() >= yesterday.getTime()) {
        for (let i = streakIndex; i >= 0 && parsed[i].count > 0; i--) {
          streak++;
        }
      }
      setCurrentStreak(streak);
    } catch (cause) {
      if (signal?.aborted) return;
      const message = cause instanceof Error ? cause.message : 'Unknown error';
      console.error('Failed to load GitHub contributions:', cause);
      setData([]);
      setTotalContributions(0);
      setCurrentStreak(0);
      setError(`Could not load live GitHub activity (${message}).`);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    const controller = new AbortController();
    void fetchContributions(controller.signal);
    return () => controller.abort();
  }, [fetchContributions]);

  // Render D3 Heatmap
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const cellSize = 12;
    const cellGap = 3;
    const weekGap = cellSize + cellGap;

    const margin = { top: 28, right: 10, bottom: 20, left: 32 };

    // Group days into weeks
    const weeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    data.forEach((day, i) => {
      const dayOfWeek = day.date.getDay(); // 0 = Sun, 6 = Sat
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
      if (i === data.length - 1 && currentWeek.length > 0) {
        weeks.push(currentWeek);
      }
    });

    const width = weeks.length * weekGap + margin.left + margin.right;
    const height = 7 * weekGap + margin.top + margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('width', '100%');

    const colorScale = d3
      .scaleOrdinal<number, string>()
      .domain([0, 1, 2, 3, 4])
      .range(['#12121a', '#450a0a', '#991b1b', '#ef4444', '#f87171']);

    const borderColorScale = d3
      .scaleOrdinal<number, string>()
      .domain([0, 1, 2, 3, 4])
      .range(['#2a2a38', '#7f1d1d', '#b91c1c', '#dc2626', '#ffffff']);

    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Render Month Labels
    const monthFormat = d3.timeFormat('%b');
    const monthsGroup = g.append('g').attr('class', 'months');

    let lastMonth = -1;
    weeks.forEach((week, weekIdx) => {
      const firstDayInWeek = week[0];
      if (firstDayInWeek) {
        const month = firstDayInWeek.date.getMonth();
        if (month !== lastMonth && weekIdx < weeks.length - 1) {
          monthsGroup
            .append('text')
            .attr('x', weekIdx * weekGap)
            .attr('y', -8)
            .attr('fill', 'var(--text-muted)')
            .attr('font-size', '10px')
            .attr('font-family', "'Silkscreen', monospace")
            .text(monthFormat(firstDayInWeek.date));
          lastMonth = month;
        }
      }
    });

    // Render Day Labels (Mon, Wed, Fri)
    const daysGroup = g.append('g').attr('class', 'day-labels');
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    [1, 3, 5].forEach((dayIdx) => {
      daysGroup
        .append('text')
        .attr('x', -8)
        .attr('y', dayIdx * weekGap + cellSize / 2 + 3)
        .attr('text-anchor', 'end')
        .attr('fill', 'var(--text-muted)')
        .attr('font-size', '9px')
        .attr('font-family', "'DM Mono', monospace")
        .text(dayNames[dayIdx]);
    });

    // Render Heatmap Cells
    const weeksGroup = g.append('g').attr('class', 'weeks');

    const weekEls = weeksGroup
      .selectAll('.week')
      .data(weeks)
      .enter()
      .append('g')
      .attr('class', 'week')
      .attr('transform', (_, i) => `translate(${i * weekGap}, 0)`);

    weekEls
      .selectAll('.day-rect')
      .data((d) => d)
      .enter()
      .append('rect')
      .attr('class', 'day-rect')
      .attr('y', (d) => d.date.getDay() * weekGap)
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('fill', (d) => colorScale(d.level))
      .attr('stroke', (d) => borderColorScale(d.level))
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .style('transition', 'transform 0.1s ease, filter 0.1s ease')
      .on('mouseenter', function (_, d) {
        d3.select(this)
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2)
          .style('transform', 'scale(1.18)')
          .style('filter', 'drop-shadow(0 0 4px #ef4444)');

        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const cellRect = this.getBoundingClientRect();
          setHoveredDay({
            day: d,
            x: cellRect.left - rect.left + cellSize / 2,
            y: cellRect.top - rect.top - 8,
          });
        }
      })
      .on('mouseleave', function (_, d) {
        d3.select(this)
          .attr('stroke', borderColorScale(d.level))
          .attr('stroke-width', 1)
          .style('transform', 'scale(1)')
          .style('filter', 'none');

        setHoveredDay(null);
      });
  }, [data]);

  return (
    <div className="modern-card p-4 md:p-5 w-full relative" ref={containerRef}>
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b-2 border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitCommit size={18} className="text-[var(--accent)] animate-pulse" />
            <h3 className="font-pixel-title text-sm md:text-base text-[var(--text-primary)]">
              GitHub Contribution Heatmap
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-mono">
            Activity log for{' '}
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] font-bold hover:underline inline-flex items-center gap-1"
            >
              @{username}
              <ExternalLink size={12} />
            </a>
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-3 py-1.5 modern-card bg-[var(--bg-secondary)] flex items-center gap-2">
            <Flame size={14} className="text-[var(--accent)]" />
            <div className="flex flex-col">
              <span className="font-pixel-title text-[10px] text-[var(--accent)]">
                {totalContributions}
              </span>
              <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">
                CONTRIBUTIONS (1YR)
              </span>
            </div>
          </div>

          <div className="px-3 py-1.5 modern-card bg-[var(--bg-secondary)] flex items-center gap-2">
            <Calendar size={14} className="text-[var(--accent)]" />
            <div className="flex flex-col">
              <span className="font-pixel-title text-[10px] text-[var(--text-primary)]">
                {currentStreak} Days
              </span>
              <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">
                STREAK
              </span>
            </div>
          </div>

          <button
            onClick={() => void fetchContributions()}
            disabled={loading}
            className="p-2 modern-btn-secondary cursor-pointer hover:text-[var(--accent)] transition"
            title="Refresh Activity"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Heatmap D3 SVG Container */}
      <div className="w-full overflow-x-auto custom-scroll pb-1">
        {loading ? (
          <div className="h-36 w-full flex items-center justify-center gap-2 font-pixel-title text-xs text-[var(--text-muted)]">
            <RefreshCw size={16} className="animate-spin text-[var(--accent)]" />
            Compiling D3 Activity Map...
          </div>
        ) : error ? (
          <div className="h-36 w-full flex items-center justify-center text-center text-xs text-[var(--text-muted)]">
            {error}
          </div>
        ) : (
          <svg ref={svgRef} className="block mx-auto min-w-[650px]"></svg>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)]">
        <span className="font-pixel-title text-[10px] text-[var(--accent)]">
          D3.JS HEATMAP ENGINE
        </span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <span className="w-3 h-3 rounded-[2px] bg-[#12121a] border border-[#2a2a38]" />
          <span className="w-3 h-3 rounded-[2px] bg-[#450a0a] border border-[#7f1d1d]" />
          <span className="w-3 h-3 rounded-[2px] bg-[#991b1b] border border-[#b91c1c]" />
          <span className="w-3 h-3 rounded-[2px] bg-[#ef4444] border border-[#dc2626]" />
          <span className="w-3 h-3 rounded-[2px] bg-[#f87171] border border-[#ffffff]" />
          <span>More</span>
        </div>
      </div>

      {/* Custom Tooltip */}
      {hoveredDay && (
        <div
          className="absolute z-30 pointer-events-none modern-card px-3 py-1.5 bg-[var(--bg-card)] border-2 border-[var(--accent)] shadow-lg -translate-x-1/2 -translate-y-full"
          style={{
            left: `${hoveredDay.x}px`,
            top: `${hoveredDay.y}px`,
          }}
        >
          <div className="font-pixel-title text-[11px] text-[var(--text-primary)]">
            <span className="text-[var(--accent)] font-bold">
              {hoveredDay.day.count} {hoveredDay.day.count === 1 ? 'contribution' : 'contributions'}
            </span>
          </div>
          <div className="text-[10px] text-[var(--text-muted)] font-mono">
            {d3.timeFormat('%B %d, %Y')(hoveredDay.day.date)}
          </div>
        </div>
      )}
    </div>
  );
};
