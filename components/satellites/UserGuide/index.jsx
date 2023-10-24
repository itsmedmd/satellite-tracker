/* eslint-disable max-len */
import styles from "@/components/satellites/About/index.module.scss";
import optionsStyles from "@/styles/shared/CesiumOptions.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRotate, faArrowRotateRight, faCompress, faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const UserGuide = ({ hideUserGuide }) => {
  return (
    <div
      className={`
        ${optionsStyles["navigation"]}
        ${optionsStyles["about-open"]}
      `}
    >
      <div className={`${styles["about"]} ${styles["user-guide"]}`}>
        <div className={styles["content"]}>
          <h1>User guide</h1>

          <h3>Content:</h3>
          <ol>
            <li><a href="#guide-general">General</a></li>
            <li><a href="#guide-available-interactions">Available interactions</a></li>
            <li><a href="#guide-time-flow-multiplier">Time flow multiplier</a></li>
            <li><a href="#guide-buttons">Buttons</a></li>
            <li><a href="#guide-search">Search</a></li>
            <li><a href="#guide-settings-and-extra-info">Visibility settings and extra information</a></li>
          </ol>

          <ol>
            <li id="guide-general">
              <h3>General:</h3>
              <ul>
                <li>For higher performance it&apos;s recommended to hide some satellites (see <a href="#guide-settings-and-extra-info">6. Visibility settings and extra information</a> section).</li>
                <li>Performance will be better with lower time flow multiplier values (see <a href="#guide-time-flow-multiplier">3. Time flow multiplier</a> section).</li>
                <li>By default 2 satellite categories (&quot;Debris&quot; and &quot;Other&quot;) are hidden to increase initial performance and user experience.</li>
                <li>If time flow multiplier (see <a href="#guide-time-flow-multiplier">3. Time flow multiplier</a> section) is 0, simulation time will still keep on going forwards in time with the multiplier speed of 1x in the background, so changing time flow multiplier to a value other than 0 will make satellite positions jump a bit.</li>
              </ul>
            </li>

            <li id="guide-available-interactions">
              <h3>Available interactions:</h3>
              <ul>
                <li>Single click on satellite point (or label if visible) - shows satellite orbit path and extra satellite information. If its orbit and extra information is already visible, it will be turned off instead.</li>
                <li>Single click on satellite orbit path - turns off the orbit but leaves extra satellite information visible.</li>
                <li>Double click on satellite point - does the same thing as a single click but also starts tracking the satellite. Simulation camera will center on the tracked satellite.</li>
                <li>To stop tracking a satellite you can:</li>
                <ol>
                  <li>Click on the 1st button (see <a href="#guide-buttons">4. Buttons</a> section). This will also reset the camera to the default view.</li>
                  <li>Double click on an empty place where there are no buttons or satellites. This leaves camera in the same position, which might be hard to control.</li>
                </ol>
              </ul>
            </li>

            <li id="guide-time-flow-multiplier">
              <h3>Time flow multiplier:</h3>
              <p>
                Time flow multiplier is the slider at the bottom of the screen.
                It controls the speed of the simulation by multiplying it by the displayed number.

                Positive number - satellites will move forwards.
                Negative number - satellites will move backwards.
                0 - satellites will not move.

                If time flow multiplier is not 0, a &quot;STOP&quot; button will be displayed next to the multiplier.
                Clicking on it will reset the time flow multiplier to 0.
              </p>
            </li>

            <li id="guide-buttons">
              <h3>Buttons:</h3>
              <ol>
                <li>
                  <FontAwesomeIcon icon={faCameraRotate}/> - <span>Resets camera position to default and stops tracking a satellite if one is currently being tracked.</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faArrowRotateRight}/> - <span>Clears screen from extra entities: turns off satellite orbits and labels; restores satellite point sizes to default.</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCompress}/> - <span>Toggles browser fullscreen mode.</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCircleInfo}/> - <span>Shows user guide.</span>
                </li>
              </ol>
            </li>

            <li id="guide-search">
              <h3>Search:</h3>
              <ul>
                <li>&quot;Search&quot; button - opens search window.</li>
                <li>&quot;Search&quot; &gt; input field - typing satellite name, satellite category name or satellite number will show satellites that match the search. Initial search shows a limited number of results.</li>
                <li>&quot;Search&quot; &gt; &quot;+&quot; button - show more search results.</li>
                <li>&quot;Search&quot; &gt; &quot;-&quot; button - show less search results.</li>
                <li>&quot;Search&quot; &gt; search result &gt; &quot;Select&quot; button - start tracking selected satellite. See <a href="#guide-available-interactions">2. Available interactions</a> section to learn about satellite tracking.</li>
                <li>If &quot;Select&quot; button is disabled, it means that the satellite category is hidden. You can see how to unhide it in <a href="#guide-settings-and-extra-info">6. Visibility settings and extra information</a> section.</li>
              </ul>
            </li>

            <li id="guide-settings-and-extra-info">
              <h3>Visibility settings and extra information:</h3>
              <ul>
                <li>&quot;Options&quot; button - opens visibility settings. Clicking on category name toggles the visibility of satellites for that category. The number in parentheses is the number of satellites in that category.</li>
                <li>&quot;Options&quot; &gt; &quot;Learn about this project&quot; button - attribution and some information about the project.</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
      <button
        onClick={hideUserGuide}
        className={`
          ${optionsStyles["about-page-toggle"]}
          ${optionsStyles["close-user-guide"]}
        `}
      >
        Close user guide
        <span className={optionsStyles["button-extra-info"]}>
          &#40;It can always be opened by clicking the <FontAwesomeIcon icon={faCircleInfo}/> icon&#41;
        </span>
      </button>
    </div>
  );
};

export default UserGuide;
