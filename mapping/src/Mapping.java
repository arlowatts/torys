import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.ImageIcon;
import java.awt.image.BufferedImage;

import java.lang.Math;

import javax.imageio.ImageIO;
import java.io.IOException;
import java.io.File;

public class Mapping {
	public static final int NUM_BANDS = 3;
	
	private static JFrame frame;
	private static BufferedImage image;
	private static Map map;
	
	public static void main (String[] args) {
		if (args.length == 1) {
			/* load map from file */
			System.out.println("To create a new map, enter a width and height as arguments");
			return;
		}
		else if (args.length == 2) {
			int width = Integer.parseInt(args[0]);
			int height = Integer.parseInt(args[1]);
			
			map = new Map(width, height, NUM_BANDS);
		}
		else {
			System.out.println("To create a new map, enter a width and height as arguments");
			return;
		}
		
		frame = new JFrame("The Heart of a Dead Star");
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setLocationRelativeTo(null);
		frame.setVisible(true);
		
		image = map.toImage();
		JLabel label = new JLabel(new ImageIcon(image));
		frame.getContentPane().add(label);
		frame.pack();
		
		double R = 5.05425;
		double r = 1.31675;
		int layers = 5;
		
		for (int a = 0; a < map.getWidth(); a++) {
			for (int b = 0; b < map.getHeight(); b++) {
				double phi = (double)a / map.getWidth() * Math.PI * 2;
				double theta = (double)b / map.getHeight() * Math.PI * 2;
				
				double x = Math.sin(phi) * (R - Math.cos(theta) * r) + R + r;
				double y = Math.sin(theta) * r + r;
				double z = Math.cos(phi) * (R - Math.cos(theta) * r) + R + r;
				
				double val = 0;
				
				for (int i = 0; i < layers; i++) {
					double factor = 1.0 / Math.pow(2, (i + 1));
					
					val += Noise.getNoise(i, 1 * factor, map.getWidth(), map.getHeight(), x, y, z) * factor;
				}
				
				if (val < 0.5)
					map.setSample(a, b, 2, (int)((val / 4 + 0.75) * 256));
				else if (val < 0.7)
					map.setSample(a, b, 1, (int)(val * 256));
				else {
					for (int i = 0; i < 3; i++) map.setSample(a, b, i, 255);
				}
			}
		}
		
		map.toImage(image);
		label.updateUI();
		
		try {ImageIO.write(image, "png", new File("noise.png"));}
		catch (IOException e) {System.out.println(e);}
	}
}