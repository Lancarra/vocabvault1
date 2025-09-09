import React from "react";
import { Link } from "react-router-dom";

/**
 * props:
 *  - items: Array<{ label: string, href?: string }>
 *  - separator?: React.ReactNode (по умолчанию "›")
 *  - className?: string
 *  - collapseAfter?: number (сворачивать длинные пути в …)
 */
const Breadcrumbs = ({
                         items = [],
                         separator = "›",
                         className = "",
                         collapseAfter = 6,
                     }) => {
    if (!items.length) return null;

    const shouldCollapse = items.length > Math.max(3, collapseAfter);
    const head = shouldCollapse ? items.slice(0, 1) : items;
    const middle = shouldCollapse ? items.slice(1, -2) : [];
    const tail = shouldCollapse ? items.slice(-2) : [];

    const renderItem = (item, idx, isLast) => (
        <li key={`${item.label}-${idx}`} className="bc-item">
            {item.href && !isLast ? (
                <Link to={item.href} className="bc-link" title={item.label}>
                    {item.label}
                </Link>
            ) : (
                <span
                    className={`bc-current ${isLast ? "is-current" : ""}`}
                    aria-current={isLast ? "page" : undefined}
                    title={item.label}
                >
          {item.label}
        </span>
            )}
        </li>
    );

    return (
        <nav className={`breadcrumbs ${className}`} aria-label="Breadcrumb">
            <ol className="bc-list">
                {shouldCollapse ? (
                    <>
                        {renderItem(head[0], 0, false)}
                        <span className="bc-sep" aria-hidden>{separator}</span>

                        {/* Ellipsis dropdown */}
                        <li className="bc-ellipsis">
                            <details>
                                <summary aria-label={`Показать ${middle.length} разделов`}>
                                    …
                                </summary>
                                <div className="bc-menu">
                                    <ul>
                                        {middle.map((m, i) => (
                                            <li key={`mid-${i}`}>
                                                {m.href ? (
                                                    <Link to={m.href} className="bc-menu-link" title={m.label}>
                                                        {m.label}
                                                    </Link>
                                                ) : (
                                                    <span className="bc-menu-text" title={m.label}>
                            {m.label}
                          </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </details>
                        </li>

                        <span className="bc-sep" aria-hidden>{separator}</span>

                        {tail.map((it, i) => (
                            <React.Fragment key={`tail-${i}`}>
                                {i > 0 && <span className="bc-sep" aria-hidden>{separator}</span>}
                                {renderItem(it, items.length - tail.length + i, i === tail.length - 1)}
                            </React.Fragment>
                        ))}
                    </>
                ) : (
                    items.map((it, i) => (
                        <React.Fragment key={`all-${i}`}>
                            {i > 0 && <span className="bc-sep" aria-hidden>{separator}</span>}
                            {renderItem(it, i, i === items.length - 1)}
                        </React.Fragment>
                    ))
                )}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
